// components/ThemeToggleButton.jsx
import { IconButton } from "@chakra-ui/react";
import { LuSun, LuMoon } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";

export default function ThemeToggleButton({ top = 8, right = 17 }) {
  const { toggleColorMode, colorMode } = useColorMode();

  const buttonBg = colorMode === "light" ? "gray.700" : "white";
  const buttonColor = colorMode === "light" ? "white" : "black";

  return (
    <IconButton
      onClick={toggleColorMode}
      variant="solid"
      size="lg"
      rounded="full"
      position="absolute"
      opacity={"0.7"}
      color={buttonColor}
      backgroundColor={buttonBg}
      height="60px"
      width="60px"
      top={1.5}
      right={23}
      _hover={{ opacity: 1, transform: "scale(1.05)" }}
      aria-label="Toggle color mode"
      icon={colorMode === "light" ? <LuMoon size={24} /> : <LuSun size={24} />}
    />
  );
}
