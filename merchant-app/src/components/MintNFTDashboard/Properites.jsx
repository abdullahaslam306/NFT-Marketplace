import React from "react";
import Grid from "@mui/material/Grid";
import { mintnftDashboardStyles } from "./MintNFTDashboardStyle";
import EditIcon from "@mui/icons-material/Edit";

function Properties({ isEdit }) {
  const classes = mintnftDashboardStyles();
  return (
    <div>
      {isEdit ? (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} className={classes.propertiesWrapper}>
            <div className={classes.propertiesContainer}>
              <EditIcon className={classes.editPencil} />
              <div className={classes.propertiesTopSection}>
                <h5 className={classes.propertiesHeading}>Properties</h5>
                <p className={classes.propertiesHeadingValue}>
                  Textual properties that describe your unique NFT
                </p>
              </div>

              <div className={classes.propertiesbottomSection}>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>{" "}
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} className={classes.propertiesWrapper}>
            <div className={classes.propertiesContainerEdit}>
              <EditIcon className={classes.editPencil} />
              <div className={classes.propertiesTopSection}>
                <h5 className={classes.propertiesHeading}>Properties</h5>
                <p className={classes.propertiesHeadingValue}>
                  Textual properties that describe your unique NFT
                </p>
              </div>

              <div className={classes.propertiesbottomSection}>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>{" "}
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
                <div className={classes.propertiesValue}>
                  <p className={classes.propertiesMediaType}>Media Type</p>
                  <h5 className={classes.propertiesMediaValue}>4K HDR</h5>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
export { Properties };
