import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CheckoutSuccess from "./components/CheckoutSuccess.";

function App() {

  return (
    <div
      style={{
        backgroundColor: "#404258",
        height: "100%",
        minHeight: "100vh",
        color: "#c5c5c5"
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkoutSuccess" element={<CheckoutSuccess />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
