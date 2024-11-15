import React, { useState, useEffect } from "react";
import { useApolloClient, gql } from "@apollo/client";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, onAuthStateChangedListener } from "../config/Firebase";

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
      id
      email
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: name!, $email: String!, $password: String!) {
    insert_users_one(object: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const client = useApolloClient();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        console.log("User authenticated: ", user);
      } else {
        console.log("User not authenticated.");
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    try {
      await loginUser(email, password);
      const { data } = await client.query({
        query: LOGIN_QUERY,
        variables: { email, password },
      });

      if (data.users.length > 0) {
        alert("Logged in successfully!");
        navigate("/home");
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    try {
      await registerUser(email, password);
      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { name, email, password },
      });

      if (data.insert_users_one) {
        alert("User registered successfully!");
        navigate("/home");
      } else {
        alert("Failed to register user in Hasura.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xs" className="auth-container">
      <Typography variant="h4" gutterBottom>
        {isLogin ? "Login" : "Register"}
      </Typography>

      {!isLogin && (
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <Typography color="error">{error}</Typography>}

      <Button
        className="button-login-register"
        variant="contained"
        color="inherit"
        fullWidth
        onClick={isLogin ? handleLogin : handleRegister}
      >
        {isLogin ? "Login" : "Register"}
      </Button>

      <Button
        className="button-switch-login-register"
        variant="text"
        fullWidth
        color="inherit"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Register here!"
          : "Already have an account? Login here!"}
      </Button>
    </Container>
  );
};

export default Auth;