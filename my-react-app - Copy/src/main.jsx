import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// 1. OVO JE OBAVEZNO - uvoz tvog theme fajla
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Ovde uvek stavi "dark" direktno ili theme.config.initialColorMode */}
      <ColorModeScript initialColorMode="dark" />

      {/* 3. Prosledi uvezeni theme */}
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
