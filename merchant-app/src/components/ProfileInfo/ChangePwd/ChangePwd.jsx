import {Grid, Container, Typography} from "@mui/material";
import {changePwdStyle} from "./style";
import {useTheme} from "@mui/material/styles";


export function ChangePwd() {
  const theme = useTheme();
  const profileClasses = changePwdStyle(theme);

  return (
      <Container className={profileClasses.container} sx={{p:"48px!important"}}>
        <Grid container xs={12}>
          <Grid item md={7} sx={{alignSelf:"center"}}>
            <Typography>
              Click the “UPDATE MY PASSWORD” button and you will receive a 6-digit
              verification code to both your email and your phone number.
            </Typography>
          </Grid>
        </Grid>
      </Container>
  );
}
