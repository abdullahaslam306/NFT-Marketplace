import {
  Typography,
  Container,
  Grid,
  TextField,
  createStyles,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../InputField";
import SelectField from "../../selectField/SelectField";
import { actions } from "../../../actions";
import { useTheme } from "@mui/system";

const useSectionStyle = makeStyles(() =>
  createStyles({
    container: {
      background: "#383F4E",
      height: "100%",
      width: "100%",
      float: "left",
      marginTop: "20px",
      borderRadius: "4px",
    },
    disabled: {
      borderStyle: "dotted",
    },
  })
);
const useStyles = makeStyles((theme) => ({
  row: { display: "flex" },
  container: {
    // [theme.breakpoints.down("md")]: {
    //     textAlign: "center",
    // },
  },
  item: {
    padding: "10px",
    border: "1px solid lightblue",
  },
}));

export function PrivateInfoComponent({props, isEdit, userProfile, handleChange, values}  ) {
  
  const profileClasses = useSectionStyle();
  const classes = useStyles();
  const profile = useSelector((state) => state.profileReducer || {});
  const user = useSelector((state) => state.profileReducer || {});
  const dispatch = useDispatch();
  const countries = profile.countriesList.length ? profile.countriesList : [];
  const languages = profile.languagesList.length ? profile.languagesList : [];
  const currencies = profile.currenciesList.length
    ? profile.currenciesList
    : [];
  const states = profile.statesList.length ? profile.statesList : [];
  const theme = useTheme();
 

  return (
    <Container className={profileClasses.container} sx={{ padding:{sm:"48px!important", xs: "16px!important"}}}>
      <Grid container className={classes.container}>
        <Grid item xs={12} md={12} style={{ padding: "10px" }}>
          <Typography
            sx={{ color: theme.palette.disabledText.main, fontSize: "12px" }}
          >
            Email
          </Typography>
          <Typography
            sx={{ color: theme.palette.disabledText.main, fontSize: "1rem" }}
          >
            {userProfile?.email}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.container} >
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <InputField
            disabled={!isEdit}
            fullWidth={true}
            id="firstname"
            label="First Name"
            name="firstName"
            onChange={handleChange}
            value={values?.firstName || ""}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <InputField
            disabled={!isEdit}
            fullWidth={true}
            id="lastname"
            label="Last Name"
            name="lastName"
            onChange={handleChange}
            value={values.lastName || ""}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.container}>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <SelectField
            value={values.defaultLanguage || userProfile?.defaultLanguage || ""}
            onChange={handleChange}
            fullWidth={true}
            label="Default Language"
            id={"language"}
            name="defaultLanguage"
            disabled={!isEdit}
            menuItems={languages}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <SelectField
            value={values.defaultCurrency || ""}
            onChange={handleChange}
            select
            fullWidth={true}
            menuItems={currencies}
            label="Default Currency"
            id="outlined-select-currency"
            name="defaultCurrency"
            disabled={!isEdit}
          />
        </Grid>
      </Grid>
      <div className={classes.row} style={{paddingTop:"16px!important", paddingBottom:"16px!important"}}>
        <Typography
         sx={{fontSize:"16px!important", py:"24px!important", pl:"15px!important"}}
        >
          Address
        </Typography>
      </div>
      <Grid container className={classes.container}>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <TextField
            select
            value={values.country || ""}
            disabled={!isEdit}
            id="outlined-select-country"
            label="Default Country"
            name="country"
            fullWidth={true}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          >
            {countries.map((option) => (
              <MenuItem key={option.iso3 || option.index} value={option.iso3}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          {(values.country && ["USA", "CAN"].includes(values.country)) ||
          (!values.country &&
            userProfile?.country &&
            ["USA", "CAN"].includes(userProfile.country)) ? (
            <>
              <TextField
                disabled={!isEdit}
                id="outlined-select-state"
                style={{ textAlign: "left" }}
                select
                label="State"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                defaultValue={values.state || userProfile?.state}
                value={values.state}
                name="state"
              >
                {states &&
                  states.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item.code}
                      defaultValue={
                        item.code === values.state ||
                        item.code === userProfile.state
                      }
                      selected={
                        item.code === values.state ||
                        item.code === userProfile.state
                      }
                    >
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
            </>
          ) : (
            <InputField
              disabled={!isEdit}
              id="outlined-select-state"
              InputLabelProps={{ shrink: true }}
              label="State"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={values.state }
              name="state"
            />
          )}
        </Grid>

        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <InputField
            disabled={!isEdit}
            fullWidth
            id="streetaddress"
            label="Street Address"
            name="address"
            autoComplete="streetaddress"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={values.address }
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <InputField
            disabled={!isEdit}
            
            fullWidth
            id="city"
            label="City"
            name="city"
            autoComplete="city"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={values.city }
          />
        </Grid>

        <Grid item xs={12} md={6} style={{ padding: "10px" }}>
          <InputField
            disabled={!isEdit}
            
            fullWidth
            id="zipcode"
            label="Zip Code"
            name="zip"
            autoComplete="zipcode"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={values.zip}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
