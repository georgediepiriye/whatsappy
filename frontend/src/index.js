import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import Register from "../src/pages/Register";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);
