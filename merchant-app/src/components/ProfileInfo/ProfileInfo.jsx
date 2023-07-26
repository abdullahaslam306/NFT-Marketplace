import {
  Typography,
  Container,
  Button,
  Modal,
  Fade,
  Paper,
  Backdrop,
  Box,
  useMediaQuery,
} from "@mui/material";
import { EditSharp, SaveSharp, LoopSharp } from "@mui/icons-material";
import { PrivateInfoComponent } from "./PrivateInfo/PrivateInfoComponent";
import { SecuritySettings } from "./SecuritySettings";
import { ChangePwd } from "./ChangePwd/ChangePwd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import Lottie from "react-lottie";
import animationData from "../successModal/lottiesAnimationData.json";
import { actions } from "../../actions";
import { useDebounce } from "../../utils/useDebounce";
// import { SecurityVerificationComponent } from "../security-verification-component";
import { phoneNumChangeText } from "../../utils/constants";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { encryptValue, getVersionId } from "../../utils/encryption";

import { useTheme } from "@mui/material/styles";
import { useProfileComponentStyle } from "./ProfileInfoStyle";
import { removehiphenSpaces, validatePhoneForE164 } from "../../utils/helper";
import { PublicInfoComponent } from "./PublicInfo/PublicInfoComponent";
import SecurityVerificationModal from "../SecurityVerificationModal/SecurityVerificationModal";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function ProfileInfo() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { profileActions, commonActions } = actions;
  const profileClasses = useProfileComponentStyle(theme);
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [open, setOpen] = React.useState(false);
  const [showModal, setShowModal] = useState(true);
  const user = useSelector((state) => state.profileReducer || {});
  const root = useSelector((state) => state.commonReducer || {});
  const profile = useSelector((state) => state.profileReducer || {});
  const [emailotp, setemailotp] = useState("");
  const [phoneotp, setphoneotp] = useState("");
  const [password, setPassword] = useState("");
  const [showPwdValidators, setshowPwdValidators] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [MFAAction, setMFAAction] = useState("");
  const [openModalName, setopenModalName] = useState("phone");
  const [values, setValues] = useState({
    twitter:
      user.userProfile && user.userProfile.twitter
        ? user.userProfile.twitter
        : "",
    instagram:
      user.userProfile && user.userProfile.instagram
        ? user.userProfile.instagram
        : "",
    facebook:
      user.userProfile && user.userProfile.facebook
        ? user.userProfile.facebook
        : "",
    bio: user.userProfile && user.userProfile.bio ? user.userProfile.bio : "",
    firstName:
      user.userProfile && user.userProfile.firstName
        ? user.userProfile.firstName
        : "",
    lastName:
      user.userProfile && user.userProfile.lastName
        ? user.userProfile.lastName
        : "",
    defaultLanguage:
      user.userProfile && user.userProfile.defaultLanguage
        ? user.userProfile.defaultLanguage
        : "",
    defaultCurrency:
      user.userProfile && user.userProfile.defaultCurrency
        ? user.userProfile.defaultCurrency
        : "",
    country:
      user.userProfile && user.userProfile.country
        ? user.userProfile.country
        : "",
    state:
      user.userProfile && user.userProfile.state ? user.userProfile.state : "",
    city:
      user.userProfile && user.userProfile.city ? user.userProfile.city : "",
    address:
      user.userProfile && user.userProfile.address
        ? user.userProfile.address
        : "",
    zip: user.userProfile && user.userProfile.zip ? user.userProfile.zip : "",
    username:
      user.userProfile && user.userProfile.username
        ? user.userProfile.username
        : "",
    email: user.userProfile && user.userProfile.email,
    twitterError: false,
    usernameError: false,
    shortBioError: false,
    nameError: false,
    instagramError: false,
  });
  const phoneNumber = user.userProfile ? user.userProfile.phone : "";

  useEffect(() => {
    setPhone(phoneNumber);
  }, [phoneNumber, open]);

  const handleOnChangeInputNumber = (value) => {
    const newStr = removehiphenSpaces(value.toString());
    setPhone(newStr);
    if (newStr.length <= 10) {
      setPhoneNoError(true);
    } else {
      setPhoneNoError(false);
    }
  };
  useEffect(() => {
    dispatch(actions.profileActions.getUserProfile());
    dispatch(actions.profileActions.getCountries());
    dispatch(actions.profileActions.getLanguages());
    dispatch(actions.profileActions.getCurrencies());

    if (user && user.userProfile) {
      setValues({
        ...values,
        twitter:
          user.userProfile && user.userProfile.twitter
            ? user.userProfile.twitter
            : values.twitter,
        instagram:
          user.userProfile && user.userProfile.instagram
            ? user.userProfile.instagram
            : values.instagram,
        facebook:
          user.userProfile && user.userProfile.facebook
            ? user.userProfile.facebook
            : values.facebook,
        bio:
          user.userProfile && user.userProfile.bio ? user.userProfile.bio : "",
        firstName:
          user.userProfile && user.userProfile.firstName
            ? user.userProfile.firstName
            : values.firstName,
        lastName:
          user.userProfile && user.userProfile.lastName
            ? user.userProfile.lastName
            : values.lastName,
        defaultLanguage:
          user.userProfile && user.userProfile.defaultLanguage
            ? user.userProfile.defaultLanguage
            : values.defaultCurrency,
        defaultCurrency:
          user.userProfile && user.userProfile.defaultCurrency
            ? user.userProfile.defaultCurrency
            : values.defaultCurrency,
        country:
          user.userProfile && user.userProfile.country
            ? user.userProfile.country
            : values.country,
        state:
          user.userProfile && user.userProfile.state
            ? user.userProfile.state
            : values.state,
        city:
          user.userProfile && user.userProfile.city
            ? user.userProfile.city
            : values.city,
        address:
          user.userProfile && user.userProfile.address
            ? user.userProfile.address
            : values.address,
        zip:
          user.userProfile && user.userProfile.zip
            ? user.userProfile.zip
            : values.zip,
        username:
          user.userProfile && user.userProfile.username
            ? user.userProfile.username
            : values.username,
      });
    }
  }, [user.userProfile && user.userProfile.email]);

  if (
    user.userProfile &&
    user.userProfile.country &&
    ["USA", "CAN"].includes(user.userProfile.country) &&
    !profile.statesList.length
  ) {
    dispatch(profileActions.getStatesFromCountries(user.userProfile.country));
  }

  useEffect(() => {
    if (
      profile.updatePwdSuccess ||
      profile.updatePhoneSuccess ||
      user.updateProfileSuccess
    ) {
      setTimeout(() => {
        dispatch(commonActions.setModalState(false));
        timerForModal();
      }, 5000);
    }
  }, [profile, user]);

  function handleClose() {
    setOpen(false);
    setShowModal(false);
    dispatch(actions.commonActions.setModalState(false));
    setemailotp("");
    setphoneotp("");
    dispatch(actions.profileActions.getUserProfile());
    dispatch(profileActions.clearValues());
  }

  const timerForModal = () => {
    // setTimeout(() => {
    setOpen(false);
    setemailotp("");
    setphoneotp("");
    dispatch(actions.profileActions.clearValues());
    // }, 5000);
  };
  // if (profile && (profile.updatePwdSuccess || profile.updatePhoneSuccess)) {
  //   timerForModal();
  // }

  const handleEmailOTPFn = (otp) => {
    setemailotp(otp);
  };

  const handlePhoneOTPFn = (otp) => {
    setphoneotp(otp);
  };

  const handleConfirmTransaction = () => {
    dispatch(commonActions.setLoading(true));
    if (openModalName === "phone") {
      dispatch(
        profileActions.updatePhoneNumber({
          transactionUid: profile && profile.transId,
          emailCode: emailotp,
          phoneCode: phoneotp,
          phone: phone,
        })
      );
    } else if (openModalName === "password") {
      if (validatePassword(password)) {
        dispatch(
          profileActions.updatePassword({
            transactionUid: profile && profile.transId,
            emailCode: emailotp,
            phoneCode: phoneotp,
            password: encryptValue(password),
            version: getVersionId(),
          })
        );
      }
    }
  };

  const resendCodeClicked = (type) => {
    dispatch(
      profileActions.resendMFA({
        transactionUid: profile && profile.transId,
        action: MFAAction,
        channel: type,
      })
    );
  };

  const changePasswordClicked = async () => {
    user.editedProfile = null;
    setOpen(true);
    setemailotp("");
    setphoneotp("");
    setMFAAction("updatePassword");
    dispatch(commonActions.setLoading(true));
    dispatch(profileActions.sendMFA({ action: "updatePassword" }));
    setopenModalName("password");
    setShowModal(true);
    setPhoneNoError(false);
  };

  const changePhoneNumberClicked = async () => {
    setOpen(true);
    setemailotp("");
    setphoneotp("");
    if (open) {
      if (phoneNoError) {
      } else if (phone !== phoneNumber) {
        dispatch(commonActions.setLoading(true));
        setMFAAction("updatePhone");
        dispatch(
          profileActions.sendMFA({ action: "updatePhone", phone: phone })
        );
        setShowModal(true);
        setopenModalName("phone");
        setPhoneNoError(false);
      } else {
        setOpen(false);
        setPhoneNoError(false);
        dispatch(
          commonActions.displaySnackbar(
            "This phone number is already Verified."
          )
        );
      }
    }
  };

  const [passwordValidators, setPasswordValidators] = React.useState({
    isContainLowerCase: false,
    isContainUpperCase: false,
    isContainSpecialChar: false,
    isContainMinimumLength: false,
    isContainNumber: false,
  });

  function validatePassword(password) {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let isLengthValid = password.length > 7;
    let lc = /[a-z]/.test(password);
    let uc = /[A-Z]/.test(password);
    let sc = format.test(password);
    let number = /\d/.test(password);

    setPasswordValidators({
      isContainLowerCase: lc,
      isContainUpperCase: uc,
      isContainSpecialChar: sc,
      isContainMinimumLength: isLengthValid,
      isContainNumber: number,
    });

    return isLengthValid && lc && uc && sc && number;
  }

  const handlePwdChange = (event) => {
    if (event.target.value) {
      setshowPwdValidators(validatePassword(event.target.value));
      validatePassword(event.target.value);
      setPassword(event.target.value);
    } else {
      setshowPwdValidators(false);
    }
    setPassword(event.target.value);
  };

  const [toggleState, setToggleState] = useState(false);

  const handleClick = () => {
    setToggleState(!toggleState);
    if (
      toggleState &&
      ((user.editedProfile?.username && user.isValidUsername) ||
        !user.editedProfile?.username)
    ) {
      if (user?.editedProfile) {
        dispatch(commonActions.setLoading(true));
        delete user.editedProfile.email;
        dispatch(profileActions.updateUserProfile(user.editedProfile));
      }
    }
  };
  const lastValue = useDebounce(values.username, 200);
  const [userNameErrorMessage, setuserNameErrorMessage] = useState("");
  useEffect(() => {
    if (lastValue) {
      if (
        (profile && profile.userProfile && profile.userProfile.username) !==
        lastValue
      ) {
        dispatch(
          actions.profileActions.checkUserName(lastValue, (valArgs) => {
            if (valArgs?.message) {
              setuserNameErrorMessage(valArgs?.message);
            } else if (
              valArgs?.responseCode?.toLowerCase() === "usernamealreadyexists"
            ) {
              setuserNameErrorMessage(valArgs?.response);
            } else if (valArgs?.response?.data?.attributes?.isAvailable) {
              setuserNameErrorMessage("");
            }
          })
        );
      }
    }
  }, [lastValue]);

  const handleChange = async (event) => {
    event.preventDefault();
    const regexUsername = /^[\w-]+$/;
    const regexTwitter = /^[\w]+$/;
    const regexInstagram = /^[\w.]+$/;
    const regexName = /^[a-zA-Z0-9 ]+$/;
    if (event.target.name !== "email") {
      if (
        (event.target.name === "country" && event.target.value === "USA") ||
        event.target.value === "CAN"
      ) {
        dispatch(profileActions.getStatesFromCountries(event.target.value));
      }
      if (event.target.name === "username") {
        if (event.target.value.length < 1) {
          setValues({
            ...values,
            username: "",
            usernameError: false,
          });
        } else {
          setValues({
            ...values,
            [event.target.name]: event.target.value,
            usernameError: false,
          });
        }
      } else if (event.target.name === "firstName") {
        if (!regexName.test(event.target.value)) {
          if (event.target.value.length < 1) {
            setValues({ ...values, firstName: "", nameError: true });
          }
        } else {
          setValues({
            ...values,
            [event.target.name]: event.target.value,
            nameError: false,
          });
        }
      } else if (event.target.name === "lastName") {
        if (!regexName.test(event.target.value)) {
          if (event.target.value.length < 1) {
            setValues({ ...values, lastName: "", nameError: true });
          }
        } else {
          setValues({
            ...values,
            [event.target.name]: event.target.value,
            nameError: false,
          });
        }
      } else if (event.target.name === "bio") {
        if (event.target.value.length > 1000) {
          setValues({ ...values, shortBioError: true });
        } else {
          setValues({
            ...values,
            [event.target.name]: event.target.value,
            shortBioError: false,
          });
        }
      } else {
        setValues({
          ...values,
          [event.target.name]: event.target.value,
        });
      }
      let updateObj = {};
      for (let i = 0; i < Object.keys(values).length; i++) {
        if (event.target.name === Object.keys(values)[i]) {
          updateObj[event.target.name] = event.target.value;
        } else if (values[Object.keys(values)[i]]) {
          updateObj[Object.keys(values)[i]] = values[Object.keys(values)[i]];
        }
      }
      if (updateObj["username"] === user.userProfile.username) {
        delete updateObj["username"];
      }
      dispatch(actions.profileActions.setEditedProfile(updateObj));
    }
  };

  return (
    <div
      style={
        root.modal
          ? { filter: "blur(10px)", padding: matches ? "3rem" : "16px" }
          : {
              marginLeft: root.drawer ? "" : "",
              padding: matches ? "3rem" : "16px",
            }
      }
    >
      {root && root.loading && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <Box>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={profileClasses.modal}
              open={showModal}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={true}>
                <Box>
                  {profile.sendMFASuccess ? (
                    <>
                      <LoadingIndicator
                        isModal={true}
                        title={
                          openModalName === "password"
                            ? "Updating password"
                            : "Updating phone number"
                        }
                      />
                      {/* <Typography>
                        Updating{" "}
                        {openModalName === "password"
                          ? "password"
                          : "phone number"}
                      </Typography> */}
                    </>
                  ) : !user.editedProfile ? (
                    <LoadingIndicator
                      isModal={true}
                      title="Sending verification codes to your email and phone"
                    />
                  ) : (
                    <LoadingIndicator
                      isModal={true}
                      title="Saving changes..."
                    />
                  )}
                </Box>
              </Fade>
            </Modal>
          </Box>
        </div>
      )}
      {(profile.updatePwdSuccess ||
        profile.updatePhoneSuccess ||
        user.updateProfileSuccess) && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <Box>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={profileClasses.modal}
              open={
                profile.updatePwdSuccess ||
                profile.updatePhoneSuccess ||
                user.updateProfileSuccess
              }
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={true}>
                <Paper
                  elevation={2}
                  className={profileClasses.box}
                  style={{
                    margin: "auto",
                    padding: "25px",
                    maxWidth: "500px",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Lottie options={defaultOptions} height={154} width={154} />
                  </Box>
                  <Typography style={{ fontWeight: 900, fontSize: "28px" }}>{`${
                    user.updateProfileSuccess
                      ? "Your profile was updated successfully"
                      : openModalName === "password"
                      ? "Your password is updated"
                      : "Your phone number is updated"
                  }`}</Typography>
                </Paper>
              </Fade>
            </Modal>
          </Box>
        </div>
      )}
      <Container
        style={
          profile.sendMFASuccess || root.modal ? { filter: "blur(10px)" } : {}
        }
      >
        <Typography
          component="h4"
          variant="h4"
          sx={{ fontSize: "1.75rem" }}
          className={profileClasses.greetings}
        >
          Profile Settings
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <div className={profileClasses.topRow}>
          <Typography style={{ float: "left", fontSize: "1.2rem" }}>
            Public Info
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ color: theme.palette.secondary.light }}
            startIcon={toggleState ? "" : <EditSharp />}
            disabled={values.shortBioError}
            style={
              toggleState && !values.shortBioError
                ? { background: "#00e387", color: "black", marginTop: "0px" }
                : { marginTop: "0px" }
            }
            className={profileClasses.btnclr}
            onClick={handleClick}
          >
            {toggleState ? "SAVE CHANGES" : "EDIT INFO"}
          </Button>
        </div>
        <PublicInfoComponent
          props={toggleState}
          userProfile={user.userProfile}
          handleChange={handleChange}
          userNameErrorMessage={userNameErrorMessage}
          values={values}
        />
        <div className={profileClasses.topRow}>
          <Typography style={{ float: "left", fontSize: "24px" }}>
            Personal Info
          </Typography>
        </div>
        <PrivateInfoComponent
          isEdit={toggleState}
          userProfile={user.userProfile}
          handleChange={handleChange}
          values={values}
        />
        <div className={profileClasses.topRow}>
          <Typography style={{ float: "left", fontSize: "1.2rem" }}>
            Security Settings
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ color: theme.palette.secondary.light }}
            startIcon={<LoopSharp />}
            className={profileClasses.btnclr}
            onClick={changePhoneNumberClicked}
          >
            {open ? "SAVE CHANGES" : "UPDATE PHONE NUMBER"}
          </Button>
        </div>

        <SecuritySettings
          editable={!open}
          phone={phone}
          handleOnChange={handleOnChangeInputNumber}
          phoneNoError={phoneNoError}
        />

        <div className={profileClasses.topRow}>
          <Typography style={{ float: "left", fontSize: "20px" }}>
            Change Password
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ color: theme.palette.secondary.light }}
            startIcon={<LoopSharp />}
            className={profileClasses.btnclr}
            onClick={changePasswordClicked}
          >
            UPDATE MY PASSWORD
          </Button>
        </div>

        <ChangePwd />
        {profile && profile.sendMFASuccess && (
          <SecurityVerificationModal
            showModal={showModal}
            subtitle={phoneNumChangeText}
            handlefn={handleClose}
            handleEmailOTPFn={handleEmailOTPFn}
            handlePhoneOTPFn={handlePhoneOTPFn}
            emailotp={emailotp}
            phoneotp={phoneotp}
            phone={phone}
            handleConfirmTransaction={handleConfirmTransaction}
            password={password}
            isPwd={openModalName === "password"}
            handlePwdChange={handlePwdChange}
            passwordValidators={passwordValidators}
            showPwdValidators={showPwdValidators}
            resendCodeClicked={resendCodeClicked}
            btnText={
              openModalName === "password"
                ? "RESET PASSWORD"
                : "UPDATE PHONE NUMBER"
            }
          />
        )}
      </Container>
    </div>
  );
}
