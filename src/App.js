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



function App() {
  const [deploymentLink, setDeploymentLink] = useState('');
  const [WpaDetails, setWpaDetails] = useState({ SSID: '', domain: '', username: '', password: '', backupSSID: '', backupPassword: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const [stageID, setStageID] = useState(1);
  // useref
  const stage2Ref = React.useRef(null);
  const stage2Placeolder = <div ref={stage2Ref}></div>;
  
  

  const verifyDeployment = async () => {
    try {
      const url = `${deploymentLink}?test=true`
      const response = await fetch(url, {
        redirect: "follow",
        method: "GET",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      })

      const data = await response.text(); // Assuming the response is plain text
      const parsed_json = JSON.parse(data);
      if (parsed_json.result === 'success') {
        setStageID(2);
        stage2Ref.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Stage 2
        // setAlertState({ open: true, severity: 'success', message: 'Deployment verified successfully.' })
        alert('Deployment verified successfully.');
      } else {
        alert('Verification failed. Please ensure the steps are correctly followed.');
      }
    } catch (error) {
      console.error('Error verifying deployment:', error);
      alert('An error occurred. Please check the deployment link and try again.');
    }
  };

  const instructions_stage1 = [
    { text: 'Click the following button to open Google Apps script', component: OpenGoogleAppsScriptsLink },
    { text: 'Create a new app script project named Pi IP.' },
    { text: 'In the new project, create a file called "Code.gs".' },
    { text: 'Copy the the following code into "Code.gs".', component: CodeTemplateDisplay },
    { text: 'Deploy the appscript project.' },
    { text: 'Copy and paste the URL of the deployed app into the text input. Press the verify button.' , component:DeploymentLinkInput, componentProps: {deploymentLink, setDeploymentLink, verifyDeployment}},
  ];

  const instructions_stage2 = [
    { text: 'Fill in the required details for network connectivity ', component: WpaForm, componentProps: { WpaDetails, setWpaDetails }},
    { text: 'Flash your SD card. Use the following options.', image: `${process.env.PUBLIC_URL}/public/logo512.png` },
    { text: 'Find and upload the firstrun.sh file. Press the verify button.', component:FirstRunUpload, componentProps: {selectedFile, setSelectedFile}},
    { text: 'Generate a new firstrun.sh with the network details.', component:GenerateNewFirstRun, componentProps: {deploymentLink, WpaDetails, selectedFile}},
    { text: 'Repalce the original firstrun.sh with this new firstrun.sh file.'}
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
