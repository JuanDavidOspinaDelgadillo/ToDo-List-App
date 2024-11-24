import React from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';
import Auth from './pages/auth/components/Auth'; 
import Home from './pages/home/components/Home'; 

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/home" element={<Home/>}  />
          <Route path="/form" element={<Form/> } />
        </Routes>
      </Router>
  );
}

export default App;