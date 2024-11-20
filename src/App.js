import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth/components/Auth'; 
import Home from './pages/home/components/Home'; 

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/home" element={<Home/>}  />
        </Routes>
      </Router>
  );
}

export default App;