import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import {generate_master_script, inject_script} from '../utils/generate_sh';
import { scrolltopoint } from '../utils/scrollUtils';

import { AlertContext } from './AlertProvider';

const nullorEmpty = (value) => {
    return value === null || value === '';
}

const verify_correctness = ({deploymentLink, WpaDetails, selectedFile, showAlert, setStageID,process_script}) => {
    //handling overall config
    if (!(WpaDetails.primaryEnabled || WpaDetails.backupEnabled)) {
        const post_action = (d) => scrolltopoint('wpaPrimary');
        showAlert("error",'Please enable at least one WPA configuration', post_action);
        return false;
    }

    const missingFields = [];
    if (WpaDetails.primaryEnabled) {
        if (nullorEmpty(WpaDetails.SSID)) missingFields.push('Missing: Primary SSID');
        if (nullorEmpty(WpaDetails.domain)) missingFields.push('Missing: Domain');
        if (nullorEmpty(WpaDetails.username)) missingFields.push('Missing: Primary Username');
        if (nullorEmpty(WpaDetails.password)) missingFields.push('Missing: Primary Password');
        if (missingFields.length > 0) {
            const post_action = (d) => scrolltopoint('wpaPrimary');
            showAlert("error",`${missingFields.join('\n')}`, post_action);
            return false;
        }
    }
    if (WpaDetails.backupEnabled) {
        if (nullorEmpty(WpaDetails.backupSSID)) missingFields.push('Missing: Backup SSID');
        if (nullorEmpty(WpaDetails.backupPassword)) missingFields.push('Missing: Backup Password');
        if (missingFields.length > 0) {
            const post_action = (d) => scrolltopoint('wpaPrimary');
            showAlert("error",`${missingFields.join('\n')}`, post_action);
            return false;
        }
    }

    if (nullorEmpty(deploymentLink)) missingFields.push('Missing: Deployment Link');
    if (nullorEmpty(selectedFile)) missingFields.push('Missing: firstrun.sh upload');

    if (missingFields.length > 0) {
        showAlert("error",`${missingFields.join('\n')}`, null);
        return false;
    }


    // ELSE
    const fields = [];
    if (WpaDetails.primaryEnabled) {
        fields.push(`Primary SSID: ${WpaDetails.SSID}`);
        fields.push(`Domain: ${WpaDetails.domain}`);
        fields.push(`Primary Username: ${WpaDetails.username}`);
        fields.push(`Primary Password: <hidden> cancel to double check`);
    } else {
        fields.push(`Not using WPA Enterprise (Primary)`);
    }
    if (WpaDetails.backupEnabled) {
        fields.push(`Backup SSID: ${WpaDetails.backupSSID}`);
        fields.push(`Backup Password: <hidden> cancel to double check`);
    } else {
        fields.push(`Not using WPA 2 (Backup)`);
    }
    fields.push(`Deployment Link: ${deploymentLink}`);
    fields.push(`Uploaded File: ${selectedFile.name}`);

    const post_action = (d) => {
        if (!d.cancelled) {
            scrolltopoint('stage3');
            setStageID(3);
            process_script();
        }
    }
    showAlert("success",`Please verify the following details:\n${fields.join('\n')}\n You may not change details once confirmed.`, post_action,false);
    return true;
}

const DownloadButton = ({deploymentLink, WpaDetails, selectedFile, setStageID}) => {
    // console.log(wpa_conifg);

    const {showAlert} = React.useContext(AlertContext);
    
    const process_script = () =>{

        if (!verify_correctness({deploymentLink, WpaDetails, selectedFile, showAlert, setStageID})) return;

        const reader = new FileReader();

        // TODO: lmao fix this
        if (!WpaDetails.primaryEnabled) {
            WpaDetails.SSID="dummy"
            WpaDetails.domain="dummy"
            WpaDetails.username="dummy"
            WpaDetails.password="dummy"
        }
        if (!WpaDetails.backupEnabled) {
            WpaDetails.backupSSID=null
            WpaDetails.backupPassword=null
        }
        const additions = generate_master_script(WpaDetails.SSID, WpaDetails.backupSSID, WpaDetails.domain, WpaDetails.username, WpaDetails.password, WpaDetails.backupPassword, deploymentLink);


        reader.onload = function(event) {
          const fileContent = event.target.result;
          const result = inject_script(fileContent, additions);

          const blob = new Blob([result], {type: "text/plain"});
          const element = document.createElement("a");
          element.href = URL.createObjectURL(blob);
          element.download = "firstrun.sh";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        };
        reader.readAsText(selectedFile);
    }
    const verify_script = () => {
        if (!verify_correctness({deploymentLink, WpaDetails, selectedFile, showAlert, setStageID, process_script})) return;
    }
    return (
        <Button variant="contained" color="primary" onClick={verify_script}>
            Generate new firstrun.sh
        </Button>
    );
}

const GenerateNewFirstRun = ({deploymentLink,WpaDetails,selectedFile, setStageID}) => {
    return (
        <Box>
            <DownloadButton deploymentLink={deploymentLink} WpaDetails={WpaDetails} selectedFile={selectedFile} setStageID={setStageID} />
        </Box>
    ); 
};
 
export default GenerateNewFirstRun;
