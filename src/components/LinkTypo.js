import React from "react";
import { Typography, Link } from "@mui/material";

const linkTypography = ({text, link}) => {
    return (
      <Typography>
        {text}
        <Link href={link} target="_blank" rel="noreferrer">
          {link}
        </Link>
      </Typography>
    );
  };


export default linkTypography;