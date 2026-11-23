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
      gray: "#eeeeee",
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    screens: {
      mobile: "360px",
      tablet: "769px",
      desktop: "1024px",
    },
  },
  plugins: [],
};
