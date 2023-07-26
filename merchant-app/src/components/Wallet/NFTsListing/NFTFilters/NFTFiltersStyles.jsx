import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';

export const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
        background: "#383F4E",
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
          theme.palette.mode === "light"
            ? "background: #383F4E;"
            : theme.palette.grey[300],
        "& .MuiMenu-list": {
          padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
          "& .MuiSvgIcon-root": {
            fontSize: 18,
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(1.5),
          },
          "&:active": {
            backgroundColor: alpha(
              theme.palette.grey[300],
              theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    }));