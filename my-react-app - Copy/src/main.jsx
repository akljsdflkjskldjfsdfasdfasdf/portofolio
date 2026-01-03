import React from "react";
import ReactDOM from "react-dom/client";
// *** UVEZITE ColorModeScript ***
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Uverite se da je initialColorMode postavljen na "light" (ili "dark")
const initialColorMode = "black";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 1. DODAJTE COLORMODESCRIPT PRE PROVIDERA */}
      <ColorModeScript initialColorMode={initialColorMode} />

      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
