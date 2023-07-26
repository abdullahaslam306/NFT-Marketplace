import {createStyles, makeStyles} from "@mui/styles";

export const changePwdStyle = makeStyles((theme) =>
    createStyles({
        container: {
            background: "#383F4E",
            width: "100%",
            float: "left",
            marginTop: "20px",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
        typography: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: theme => theme.palette.text.primary,
        },
    })
);
