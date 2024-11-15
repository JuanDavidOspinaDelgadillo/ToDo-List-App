import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './config/ApolloClient';  
import Auth from './pages/auth/Auth'; 
import Home from './pages/home/Home'; 
import './pages/auth/Auth.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Auth/>} />
          <Route exact path='/home' element={<Home/>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;