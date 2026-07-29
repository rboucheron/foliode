/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../ui/components/**/*.{js,ts,jsx,tsx}",
    "../ui/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        portfolio: {
          green: {
            primary: "#334B35",
            secondary: "#F6EEE1",
            accent: "#FAAF15",
            text: {
              primary: "#FFFFFF",
              secondary: "#231C0A",
            }
          },
          gold: {
            primary: "#0E0E0E",
            secondary: "#181716",
            accent: "#343230",
            text: {
              primary: "#DAC6A7",
            }
          },
        }
      },
      borderColor: {
        custom: '#2C2D33',
      },
      borderWidth: {
        '1': '1px',
      },
      borderRadius: {
        '13': '13px',
      },
      fontSize: {
        '14': '14px',
        '16': '16px',
        '20': '20px',
        '26': '26px', 
      },
    },  
  },
  darkMode: ["class"],
}