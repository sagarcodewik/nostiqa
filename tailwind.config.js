/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3711BE",
        secondary: "#7B61FF",
        accent: "#3410AF",
        light: "#F5F2FF",
        dark: "#111111",
        gray: "#666666",
        cream: "#fcf9f1",
      },
    
      fontSize: {
        "4.5": "46px",
      },
    
      backgroundImage: {
        premiumCard: "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 28%), linear-gradient(180deg,#2417A8 0%,#1A1288 45%,#12095F 100%)",
        premiumNote: "linear-gradient(180deg,#5B22FF 0%,#3D13C9 100%)",
        premiumGlow: "radial-gradient(circle at top right, rgba(255,255,255,0.28), transparent 32%), linear-gradient(90deg,#2a16b8 0%,#3d27c9 22%,#5d46df 48%,#8a75f3 72%,#c9bbff 100%)",
      },
    
      boxShadow: {
        premium: '0 8px 30px rgb(0 0 0 / 0.03)',
        glow: '0 0 40px rgba(123,97,255,.15)',
      },
    },
  },
  plugins: [],
}