/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        bp880: "880px",
      },
      backgroundSize: {
        300: "300% 300%",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 4s ease infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-custom": {
          textShadow:
            "0px 0px 20px, 0px 0px 10px #aaaaaa, 0px 0px 5px #aaaaaa, 0px 0px 20px black, 0px 0px 10px black, 0px 0px 5px black",
        },
      });
    },
  ],
};