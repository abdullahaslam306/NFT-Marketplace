export const darkTheme = {
  palette: {
    type: "dark",
    primary: {
      main: "#24D182",
      dark: "#24D182",
      light: "#82f5c7",
      contrastText: "rgba(0,0,0,0.8)",
    },
    secondary: {
      main: "#B6AEF6",
      dark: "#B6AEF6",
      light: "#b6aef6",
      contrastText: "rgba(255,255,255,0.8)",
    },
    background: {
      default: "#252B37",
      paper: "rgba(255, 255, 255, 0.09);",
      grid: "rgba(255, 255, 255, 0.12);",
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
      main: "#24D182",
      light: "#82f5c7",
      dark: "#24D182",
    },
    disabledText: {
      main: "rgba(255, 255, 255, 0.5)",
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
    fontSize: "14px",
    color: "#FFF",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: 14,
          fontWeight: 500,
          margin: "20px",
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.3)",
            background: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            background: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        // Name of the slot
        root: {
          color: "#FFF",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "100% !important",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#238165",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textDecoration: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.56)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.23)",
            },
          },
        },
        // input: {
        //   "&.Mui-disabled": {
        //     WebkitTextFillColor: "rgba(255,255,255,0.23)",
        //   },
        // },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          "&.Mui-disabled": {
            color: "rgba(255,255,255,0.23)",
          },
          color: "#FFF",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#ee463c",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "rgba(255,255,255,0.23)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#383F4E",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // padding :"16px 8px 16px 16px !important",
          background: "rgba(255, 255, 255, 0.09)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "0px 8px 0px 16px !important",
          height: "44px",
          background: "rgba(255, 255, 255, 0.09)",
        },
        title: {
          fontSize: "12px",
          lineHeight: "166%",
          letterSpacing: "0.4px",
        },
        content: {
          flex: "1 1 auto",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        action: {
          margin: 0,
          alignSelf: "center",
          ".MuiIconButton": {
            root: {
              color: "inherit",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        icon: {
          color: "#FFFFFF",
        },
      },
    },
  },
  typography: {
    fontSize: 12,
    fontWeight: 400,
    color: "#FFF",
    h6: {
      fontWeight: 900,
      color: "#FFF",
    },
    h3: {
      fontSize: "15px",
      fontWeight: 500,
    },
    h4: {
      fontSize: "20px",
      fontWeight: 900,
      color: "#FFF",
    },
    h2: {
      fontSize: "40px",
      "@media (min-width:300px) and (max-width:768px)": {
        fontSize: "30px",
      },
      fontWeight: 900,
      color: "#FFF",
    },
    body2: {
      fontSize: "12px",
      color: "#FFF",
    },
    body1: {
      fontSize: "14px",
      color: "#FFF",
    },
  },
};
