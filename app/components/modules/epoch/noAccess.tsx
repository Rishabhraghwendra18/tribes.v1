import React from "react";
import { Grid, Typography } from "@mui/material";

type Props = {};

const NoAccess = (props: Props) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "50vh" }}
    >
      <Grid item xs={3}>
        <Typography variant="h6" sx={{ mb: 2 }} color="text.primary">
          You dont have access to view epochs
        </Typography>{" "}
      </Grid>
    </Grid>
  );
};

export default NoAccess;
