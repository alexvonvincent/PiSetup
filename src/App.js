import React, { Component, useState } from 'react';
import { Container, TextField, Button, Typography, Link, Box } from '@mui/material';
import CodeTemplateDisplay from './components/CodeTemplateDisplay';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme instance
import { ThemeOptions } from '@mui/material/styles';
import InstructionsList from './components/InstructionsList';
import DeploymentLinkInput from './components/DeploymentLinkInput';
import AlertToast from './components/AlertToast';
import WpaForm from './components/WpaForm';
import FirstRunUpload from './components/FirstRunUpload';
import GenerateNewFirstRun from './components/GenerateNewFirstRun';
import linkTypography from './components/LinkTypo';

// images
import imager_start from './img/imager_start.png';
import imager_DL from './img/imager_DL.png';
import imager_confA from './img/imager_confA.png';
import imager_confB from './img/imager_confB.png';
import imager_wait from './img/imager_wait.png';
import imager_yes_1 from './img/imager_yes_1.png';
import imager_yes_2 from './img/imager_yes_2.png';
import imager_done from './img/imager_done.png';
import imager_bootfs from './img/imager_bootfs.png';

import appscripts_startA from './img/appscripts_startA.png';
import appscripts_startB from './img/appscripts_startB.png';
import appscripts_deployA from './img/appscripts_deployA.png';
import appscripts_deployB from './img/appscripts_deployB.png';
import appscripts_deployC from './img/appscripts_deployC.png';
import appscripts_rename from './img/appscripts_rename.png';
import appscripts_deployURL from './img/appscripts_deployURL.png';



export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
};
const theme = createTheme(themeOptions);

const OpenGoogleAppsScriptsLink = () => {
  return (
    <Button variant="contained" color="primary" onClick={() => window.open('https://script.google.com', '_blank')}>
      Open Google Apps Scripts
    </Button>
  );
};


function get_base_WPA() {
  const urlparam = new URLSearchParams(window.location.search);
  const template = { SSID: '', domain: '', username: '', password: '', backupSSID: '', backupPassword: '' };
  template.SSID = urlparam.get('SSID');
  template.domain = urlparam.get('domain');
  template.username = urlparam.get('username');
  template.password = urlparam.get('password');
  template.backupSSID = urlparam.get('backupSSID');
  template.backupPassword = urlparam.get('backupPassword');
  return template;
}
const base_wpa = get_base_WPA();


function App() {
  const [deploymentLink, setDeploymentLink] = useState('');
  const [deploymentLinkVerificationState, setDeploymentLinkVerificationState] = useState({ verified: false, loading: false });
  const [WpaDetails, setWpaDetails] = useState(base_wpa);
  const [selectedFile, setSelectedFile] = useState(null);

  const [stageID, setStageID] = useState(1);
  // useref
  const stage2Ref = React.useRef(null);
  const stage2Placeolder = <div ref={stage2Ref}></div>;
  
  

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
        stage2Ref.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Stage 2
        setDeploymentLinkVerificationState({ verified: true, loading: false });
        alert('Deployment verified successfully.');
      } else {
        setDeploymentLinkVerificationState({ verified: false, loading: false });
        alert('Verification failed. Please ensure the steps are correctly followed.');
      }
    })
    .catch(error => {
      console.error('Error verifying deployment:', error);
      setDeploymentLinkVerificationState({ verified: false, loading: false });
      alert('An error occurred. Please check the deployment link and try again.');
    });
  };

  const instructions_stage1 = [
    { text: 'Click the following button to open Google Apps script', component: OpenGoogleAppsScriptsLink },
    { text: 'Create a new app script project named Pi IP.' ,image: [appscripts_startA, appscripts_startB]},
    { text: 'Find the "Code.gs" file' ,image: [appscripts_rename]},
    { text: 'Copy the the following code into "Code.gs".', component: CodeTemplateDisplay },
    { text: 'Deploy the appscript project! Select New Deployment', image: [appscripts_deployA]},
    { text: 'Select Webapp. Make sure to to set Execute as: Me | Who has access: Anyone.', image: [appscripts_deployB, appscripts_deployC]},
    { text: 'Click Deploy! Get the Appscript Web app URL.', image: [appscripts_deployURL]},
    { text: 'Copy and paste the URL of the deployed app into the text input. Press the verify button.' , component:DeploymentLinkInput, componentProps: {deploymentLink, setDeploymentLink, verifyDeployment , deploymentLinkVerificationState}},
  ];

  const instructions_stage2 = [
    { text: 'Fill in the required details for network connectivity ', component: WpaForm, componentProps: { WpaDetails, setWpaDetails }},

    { text: 'Install Rpi Imager. You can get the imager at https://www.raspberrypi.com/software/', image: [imager_DL] },

    { text: 'Insert SD card into PC. Start Rpi Imager. Pick Device: Raspberry Pi 4 | Operating System: Rasbian (64bit) | Storage: Your SD Card', image: [imager_start]},

    { text: 'Press Ctrl+Shift+X. Use the following Configuration. Replace with appropriate values', image: [imager_confA,imager_confB] },

    { text: 'Press Next. Yes to use OS customization. Yes to overwrite.', image: [imager_yes_1,imager_yes_2] },

    { text: 'Wait for imager to finish', image: [imager_wait] },

    { text: 'After you are done. Remove SD card from PC.', image: [imager_done] },

    { text: 'Re-insert SD card into PC. A partition called bootfs should show up. Open the bootfs partition', image: [imager_bootfs] },

    { text: 'Find and upload the firstrun.sh file', component:FirstRunUpload, componentProps: {selectedFile, setSelectedFile}},

    { text: 'Generate a new and improved firstrun.sh with the network details (auto download).', component:GenerateNewFirstRun, componentProps: {deploymentLink, WpaDetails, selectedFile}},

    { text: 'Replace the original firstrun.sh in bootfs with this new firstrun.sh file.'},

    { text: 'Eject SD card. Insert into Raspberry Pi 4. Power on.'},

    { text: 'Wait for the Raspberry Pi to perform first boot up routine. After a few minutes, the Pi should connect to the network and push the IP to your google app script.'},

    { text: 'Check the google app script to see if the IP was pushed. You can reach the script at the URL you deployed it to.', component: linkTypography, componentProps: { text: 'Your IP checker URL: ', link: deploymentLink },}
  ];


  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom>PI Script Generator</Typography>
      <Typography variant="h6">
        Follow the instructions to create a new AppScripts project in Google Apps Scripts. 
      </Typography>
      <InstructionsList instructions={instructions_stage1} title={"Stage 1:"}  stageID={1} currentStageID={stageID}/>
      {stage2Placeolder}
      <InstructionsList instructions={instructions_stage2} title={"Stage 2:"} stageID={2} currentStageID={stageID} />
      <Box height="100vh" /> 
      
      </Container>
    </ThemeProvider>
  );
}

export default App;
