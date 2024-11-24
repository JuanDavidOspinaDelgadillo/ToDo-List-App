import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth/components/Auth'; 
import Home from './pages/home/components/Home'; 
import Form from './pages/form/components/Form';
import Galery from './pages/galery/components/Galery';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/home" element={<Home/>}  />
          <Route path="/form" element={<Form/> } />
          <Route path="/galery" element={<Galery/>} />
        </Routes>
      </Router>
  );
}

export default App;