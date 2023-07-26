import MuiPhoneNumber from "material-ui-phone-number";
import React from "react";
import { useSelector } from "react-redux";
import {Grid, Container, Typography} from "@mui/material";
import {useSecuritySettingStyle} from "./style";
import {useTheme} from "@mui/material/styles";
import {getIso2CodeCountryList} from "../../../utils/getISOcountryList";


export function SecuritySettings({ phone, handleOnChange, editable, phoneNoError }) {
    const theme = useTheme();
    const profile = useSelector((state) =>state.profileReducer || {});
    const countries = profile.countriesList.length
        ? profile.countriesList
        : [];
    const profileClasses = useSecuritySettingStyle(theme);
    return (
        <Container className={profileClasses.container} sx={{p:"48px!important"}}>
            <Grid container >
                <Grid item md={7}>
                    <Typography variant="h6">Two-Factor Authentication</Typography>
                    <Typography className={profileClasses.typography}>
                        (Valid mobile phone number is required)
                    </Typography>
                    <br></br>
                </Grid>
                <Grid item md={5} sm={12}>
                    <MuiPhoneNumber
                        disableAreaCodes={true}
                        onlyCountries={getIso2CodeCountryList(countries)}
                        defaultCountry={"us"}
                        disableDropdown={editable?true:false}
                        autoFormat={true}
                        variant="outlined"
                        value={phone}
                        onChange={handleOnChange}
                        label={"Phone Number"}
                        disabled={editable}
                        className={profileClasses.label}
                    />
                    {phoneNoError && (
                        <Typography color="error" className={profileClasses.errorClass}>
                        Please enter a valid phone number
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
