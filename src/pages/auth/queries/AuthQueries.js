import { gql } from "@apollo/client";

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
      id
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: name!, $email: String!, $password: String!) {
    insert_users_one(object: { name: $name, email: $email, password: $password }) {
      id
    }
  }
`;

export { LOGIN_QUERY, REGISTER_MUTATION };