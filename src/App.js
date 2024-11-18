import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './components/ApolloClient';  
import Auth from './pages/auth/Auth'; 
import Home from './pages/home/Home'; 

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/home" element={<Home/>}  />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;