import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App'; // Your main survey
import AdminDashboard from './AdminDashboard'; // Your new admin page

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The main survey loads on the standard URL */}
        <Route path="/" element={<App />} />
        
        {/* The admin dashboard loads ONLY on /admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);