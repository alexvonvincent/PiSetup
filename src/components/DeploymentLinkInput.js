import React from 'react';
import { TextField, Button } from '@mui/material';


const DeploymentLinkInput = ({deploymentLink, setDeploymentLink, verifyDeployment}) => {
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
            <Button variant="contained" onClick={verifyDeployment} disabled={!deploymentLink}>
              Verify
            </Button>
          </>
        );
      };

export default DeploymentLinkInput;
