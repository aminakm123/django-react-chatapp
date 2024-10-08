import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserList from "./components/UserList";
import InterestList from "./components/InterestList";
import Chat from "./components/Chat";


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <div>
        <h1>Chat App</h1>
        <Routes>
          <Route path="" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/users" element={<UserList token={token} />} />
          <Route path="/interests" element={<InterestList token={token} />} /> 
          <Route path="/chat/:userId" element={<Chat token={token} />} />
        </Routes>
      </div>
    </Router>
  );
};

// Ensure default export
export default App;
