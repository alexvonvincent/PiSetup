import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';



  
function generateWpaSupplicantScript(PRIMARY_SSID, DOMAIN, USERNAME, PASSWORD, BACKUP_NETWORK_SSID, BACKUP_NETWORK_PASSWORD) {
    // Define shell script variables for each parameter
    const scriptVariables = `PRIMARY_SSID="${PRIMARY_SSID}"
BACKUP_NETWORK_SSID="${BACKUP_NETWORK_SSID}"
DOMAIN="${DOMAIN}"
USERNAME="${USERNAME}"
PASSWORD="${PASSWORD}"
`;

    // Generate password hashes using wpa_passphrase
    const primarySSIDHash = `$(echo -n "${PASSWORD}" | iconv -t utf16le | openssl md4 -provider legacy | awk '{print $NF}')`;
    let backupSSIDHash = '';
    if (BACKUP_NETWORK_SSID && BACKUP_NETWORK_PASSWORD) {
      backupSSIDHash = `$(wpa_passphrase "${BACKUP_NETWORK_SSID}" "${BACKUP_NETWORK_PASSWORD}" | grep -oP '^\\s*psk=\\K\\S+')`;
    }

    // Construct configuration text
    let configText = `country=SG
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
ap_scan=1

network={
  ssid="\$PRIMARY_SSID"
  scan_ssid=1
  key_mgmt=WPA-EAP
  eap=PEAP
  identity="\$DOMAIN/\$USERNAME"
  password=hash:\$PRIMARY_SSID_HASH
  phase1="peaplabel=0"
  phase2="auth=MSCHAPV2"
  priority=0
}
`;

    // Add backup network configuration if provided
    if (BACKUP_NETWORK_SSID && BACKUP_NETWORK_PASSWORD) {
        configText += `
network={
  ssid="\$BACKUP_NETWORK_SSID"
  psk=\$BACKUP_SSID_HASH
  priority=1
}
`;
    }

    // Construct the final script
    const finalScript = `${scriptVariables}

# Generate password hashes
PRIMARY_SSID_HASH="${primarySSIDHash}"
${BACKUP_NETWORK_SSID && BACKUP_NETWORK_PASSWORD ? `BACKUP_SSID_HASH="${backupSSIDHash}"` : ''}

# Replace configuration text
sudo tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null <<EOF
${configText}
EOF`;

    return finalScript;
}

function addLinesAbove(fileContent, additionalLines) {
    // Find the index of the line containing 'rm -f /boot/firstrun.sh'
    const rmLineIndex = fileContent.indexOf('rm -f /boot/firstrun.sh');

    // If the line is found, insert the new lines above it
    if (rmLineIndex !== -1) {
        return fileContent.slice(0, rmLineIndex) + additionalLines + '\n' + fileContent.slice(rmLineIndex);
    } else {
        // If the line is not found, append the new lines at the end of the file
        return fileContent + '\n' + additionalLines;
    }
}

function generateScript(primarySSID, domain, username, password, backupSSID, backupPassword) {
  
  const scriptContent = generateWpaSupplicantScript(primarySSID, domain, username, password, backupSSID, backupPassword);
  
  const script_main_content = `# START ADDITIONS
setup_network() {
  # 1. Set the home of the first user
  FIRSTUSER=$(getent passwd 1000 | cut -d: -f1)
  FIRSTUSERHOME=$(getent passwd 1000 | cut -d: -f6)

  # 2. Disable NetworkManager
  sudo systemctl stop NetworkManager
  sudo systemctl disable NetworkManager

  # 3. Configure DHCP for systemd-networkd
  sudo tee /etc/systemd/network/wlan0.network > /dev/null <<EOF
[Match]
Name=wlan0

[Network]
DHCP=yes
EOF

  # 4. Enable systemd-networkd
  sudo systemctl enable systemd-networkd

  # 5. Configure wpa_supplicant.conf
${scriptContent}

  # 5a. Correctly set file permissions for wpa_supplicant.conf
  sudo chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf

  # 5b. Unblock wifi
  sudo rfkill unblock wifi
  for filename in /var/lib/systemd/rfkill/*:wlan ; do
      echo 0 > $filename
  done

  # 6. Edit wpa_supplicant.service
  sudo sed -i 's|^ExecStart=.*|ExecStart=/sbin/wpa_supplicant -u -s -O "DIR=/run/wpa_supplicant GROUP=netdev" -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf|' /lib/systemd/system/wpa_supplicant.service

  # 7. Reload systemd daemon
  # sudo systemctl daemon-reload

  # 8. Start/restart wpa_supplicant and systemd-networkd
  # sudo systemctl restart wpa_supplicant systemd-networkd

  # 9. Run verification
  # (You might want to add your verification commands here)

  # Add the current directory to a file on the desktop
  echo "$(pwd)" > "/home/$FIRSTUSER/Desktop/boot_folder.txt"
}

# Call the function
setup_network

# END ADDITIONS
`


return script_main_content;
}


const DownloadButton = ({deploymentLink, WpaDetails, selectedFile}) => {
    // console.log(wpa_conifg);

    const process_script = () =>{
        const reader = new FileReader();
        const additions = generateScript(WpaDetails.SSID, WpaDetails.domain, WpaDetails.username, WpaDetails.password, WpaDetails.backupSSID, WpaDetails.backupPassword);

        reader.onload = function(event) {
          const fileContent = event.target.result;
          const result = addLinesAbove(fileContent, additions);

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
