export const lightTheme = {
  palette: {
    type: "light",
    primary: {
      main: "#00e387",
      dark: "#00ac5e",
      light: "#82f5c7",
      contrastText: "rgba(0,0,0,0.8)",
    },
    secondary: {
      main: "#7752e0",
      dark: "#6130b9",
      light: "#b6aef6",
      contrastText: "rgba(255,255,255,0.8)",
    },
    background: {
      default: "#FFF",
      paper: "#FFF",
    },
    error: {
      main: "#ee463c",
      dark: "#c02e2d",
      light: "#DFA6A5",
      contrastText: "rgba(0,0,0,0.8)",
    },
    warning: {
      main: "#ebb440",
      light: "#f5d88f",
      dark: "#ebb440",
    },
    success: {
      main: "#00e387",
      light: "#82f5c7",
      dark: "#00ac5e",
    },
    info: {
      main: "#383F4E",
      light: "#b6aef6",
      dark: "#383F4E",
      contrastText: "rgba(255,255,255,0.8)",
    },
    active: {
      main: "rgba(255, 255, 255, 0.56)",
      light: "rgba(255, 255, 255, 0.56)",
      dark: "rgba(255, 255, 255, 0.56)",
      contrastText: "rgba(255, 255, 255, 0.56)",
    },
    white: {
      main: "rgba(255, 255, 255, 1)",
      light: "rgba(255, 255, 255, 1)",
      dark: "rgba(255, 255, 255, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.7)",
      secondary: "rgba(255, 255, 255, 0.7)",
      white: "rgba(255,255,255,1)",
    },
    divider: "#475164",
  },
  body: {
    fontSize: 14,
  },
  typography: {
    fontSize: 14,
    h2: {
      fontSize: 40,
      "@media (min-width:300px) and (max-width:768px)": {
        fontSize: 30,
      },
      fontWeight: 900,
    },
  },
};
