import {createStyles, makeStyles} from "@mui/styles";

export const useSectionStyle = makeStyles((theme) =>
    createStyles({
        container: {
            background: "#383F4E",
            height: "100%",
            width: "100%",
            float: "left",
            marginTop: "20px",
            borderRadius: "4px",
        },
        errorClass: {
            fontSize: "12px",
            textAlign: "left",
            paddingLeft: "15px",
        },
    })
);

export const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    row: { display: "flex" },
    input1: {
        height: 150,
    },
    centreButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 10px",
        position: "static",
        boxShadow:
            "0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)",
        borderRadius: "4px",
        flex: "none",
        margin: "10px 0px",
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "1.25px",
        textTransform: "uppercase",
        [theme.breakpoints.down("md")]: {
            padding: "10px 10px",
        },
        [theme.breakpoints.down("xs")]: {
            minWidth: "86px",
        },
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "250px",
        position: "relative",
    },
    container: {
        [theme.breakpoints.down("md")]: {
            textAlign: "center",
        },
    },
    item: {
        padding: "10px",
        border: "1px solid lightblue",
    },
    imageCropper: {
        width: "14.5rem",
        height: "14.5rem",
        marginTop: "0.5rem",
        position: "relative",
        overflow: "hidden",
        borderRadius: "50%",
    },
    profileImage: {
        display: "inline",
        margin: "0 auto",
        marginLeft: "-17%", //centers the image
        height: "100%",
        width: "auto",
    },
    avatar: {
        display: "inline",
        margin: "0 auto",
        marginLeft: "-17%", //centers the image
        height: "100%",
        width: "auto",
    },
}));
