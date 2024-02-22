import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import {generate_master_script, inject_script} from '../utils/generate_sh';


const DownloadButton = ({deploymentLink, WpaDetails, selectedFile}) => {
    // console.log(wpa_conifg);

    const process_script = () =>{
        const reader = new FileReader();

        // generate_master_script (primarySSID, backupSSID, domain, username, password, backupPassword) 
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

    return (
        <Button variant="contained" color="primary" onClick={process_script}>
            Generate new firstrun.sh
        </Button>
    );
}

const GenerateNewFirstRun = ({deploymentLink,WpaDetails,selectedFile}) => {
    console.log({deploymentLink, WpaDetails, selectedFile});
    return (
        <Box>
            <DownloadButton deploymentLink={deploymentLink} WpaDetails={WpaDetails} selectedFile={selectedFile} />
        </Box>
    ); 
};
 
export default GenerateNewFirstRun;
