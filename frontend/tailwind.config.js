/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#4c2365",
      secondary: "#9e7eb5",
      background: "#ffffff",
      success: "#93da97",
      failure: "#e14242",
      heading: "#000000",
      muted: "#aaaaaa",
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
  },
  plugins: [],
};
