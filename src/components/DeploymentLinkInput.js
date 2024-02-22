import React from 'react';
import { TextField, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useTheme } from "@mui/material";
const DeploymentLinkInput = ({deploymentLink, setDeploymentLink, verifyDeployment, deploymentLinkVerificationState}) => {
        const {palette} = useTheme();
        const verificationBtnEnabled = !deploymentLinkVerificationState.loading && !deploymentLink;

        return (
          <>
            <TextField
              label="AppScript Deployment Link"
              variant="outlined"
              fullWidth
              value={deploymentLink}
              onChange={(e) => setDeploymentLink(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" onClick={verifyDeployment} disabled={verificationBtnEnabled}>
                {deploymentLinkVerificationState.loading ? <CircularProgress size={24} style={{color: palette.primary.contrastText}} /> : 'Verify'}
            </Button>
          </>
        );
      };

export default DeploymentLinkInput;
