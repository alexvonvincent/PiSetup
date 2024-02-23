import React from 'react';
import { TextField, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useTheme } from "@mui/material";

import { AlertContext } from './AlertProvider';
import { scrolltopoint } from '../utils/scrollUtils';


const DeploymentLinkInput = ({deploymentLink, setDeploymentLink, deploymentLinkVerificationState, setDeploymentLinkVerificationState, setStageID, stage2Ref}) => {

        const {palette} = useTheme();
        const {showAlert} = React.useContext(AlertContext);
        
        const verificationBtnEnabled = !deploymentLinkVerificationState.loading && !deploymentLink;
        const verifyDeployment = () => {
          setDeploymentLinkVerificationState({ verified: false, loading: true }); // Set loading state
          const url = `${deploymentLink}?verify=true`
          fetch(url, {
            redirect: "follow",
            method: "GET",
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
          })
          .then(response => response.text())
          .then(data => {
            const parsed_json = JSON.parse(data);
            if (parsed_json.result === 'success') {
              setStageID(2);
              const post_action = (dummy) => scrolltopoint("stage2"); // Scroll to Stage 2
              
              setDeploymentLinkVerificationState({ verified: true, loading: false });
              showAlert("success",'Deployment verified successfully.', post_action);

            } else {
              setDeploymentLinkVerificationState({ verified: false, loading: false });
              showAlert("error",'Verification failed. Please ensure the steps are correctly followed.', null);
            }
          })
          .catch(error => {
            console.error('Error verifying deployment:', error);
            setDeploymentLinkVerificationState({ verified: false, loading: false });
            showAlert("error",'An error occurred. Please check the deployment link and try again.',null);
          });
        };


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
