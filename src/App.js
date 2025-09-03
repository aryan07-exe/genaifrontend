// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Page from "./components/Page";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<Login />} />
        {/* Pass a real userId here after login/registration */}
        <Route path="/chat" element={<Chat userId={2} />} />
      </Routes>
    </Router>
  );
}

export default App;
