import React, { useEffect } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import ThemeToggleButton from "./components/ActionToggle/ThemeToggleButton";
import Navbar from "./components/nav";
import VremenskaPrognoza from "./components/pages/skills/vremenskaPrognoza";
import Aurora from "./components/Aurora/Aurora";
import Home from "./components/pages/Home";
import Skills from "./components/pages/Skills";
import Contact from "./components/pages/Contact";
import Restoranpizza from "./components/pages/skills/restoranpizza";

function App() {
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();
  const bgColor = colorMode === "light" ? "gray.100" : "black";

  // Uslov: Ako je putanja /pizzarestaurant, sakrij sve globalno
  const isPizzaPage = pathname === "/pizzarestaurant";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      bg={bgColor}
      position="relative"
      overflowX="hidden"
    >
      {/* 1. Sakrivamo Auroru ako je pizza stranica */}
      {!isPizzaPage && <Aurora />}

      {/* 2. Sakrivamo Navbar i Toggle ako je pizza stranica */}
      {!isPizzaPage && (
        <Box
          position="fixed"
          top={5}
          left="50%"
          transform="translateX(-50%)"
          w="95%"
          zIndex={50}
        >
          <Navbar />
          <ThemeToggleButton />
        </Box>
      )}

      <Box position="relative" zIndex={1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/weather" element={<VremenskaPrognoza />} />
          <Route path="/pizzarestaurant" element={<Restoranpizza />} />
        </Routes>
      </Box>

      {!isPizzaPage && <Box h="50px" />}
    </Box>
  );
}

export default App;
