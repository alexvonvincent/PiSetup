import PUSH_IP_SCRIPT from '../scriptsources/pushIP.js';


const BASE_WPA_CONF = `country=SG
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
  priority=1
}
`;

const EXTRA_WPA_CONF = `
network={
  ssid="\$BACKUP_NETWORK_SSID"
  psk=\$BACKUP_SSID_HASH
  priority=0
}
`;

const DHCP_CONFIG = `
sudo tee /etc/systemd/network/wlan0.network > /dev/null <<EOF
[Match]
Name=wlan0

[Network]
DHCP=yes
EOF
`;

const SYSTEMTL_COMMANDS = `
### Configuring Services ###

# Disable NetworkManager to stop intereference with wpa_supplicant
sudo systemctl stop NetworkManager
sudo systemctl disable NetworkManager

# Enable systemd-networkd service for DHCP
sudo systemctl enable systemd-networkd


### End Configuring Services ###
`;

const UTILITY_SWITCH_TO_NETWORKMANAGER = `
# Enable NetworkManager
echo "Enabling NetworkManager and disabling systemd-networkd"
sudo systemctl stop systemd-networkd
sudo systemctl disable systemd-networkd
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
echo "ok!"
`;

const UTILITY_SWITCH_TO_WPASUPP = `
# Enable wpa_supplicant
echo "Enabling wpa_supplicant and disabling NetworkManager"
sudo systemctl stop NetworkManager
sudo systemctl disable NetworkManager
sudo systemctl enable wpa_supplicant
sudo systemctl restart wpa_supplicant
sudo systemctl enable systemd-networkd
sudo systemctl start systemd-networkd
echo "ok!"
`;


function generate_script_variable(variableName, variableValue) {
    return `${variableName}="${variableValue}"`
}

function generate_WPA_script_variables(primarySSID, backupSSID, domain, username, password, backupPassword) {
    let scriptVariables = `
### Script Variables ###
${generate_script_variable('PRIMARY_SSID', primarySSID)}
${generate_script_variable('DOMAIN', domain)}
${generate_script_variable('USERNAME', username)}
${generate_script_variable('PRIMARY_SSID_HASH', generate_WPAE_hash_command(password))}`;
    if (backupSSID && backupPassword) {
        scriptVariables += `
${generate_script_variable('BACKUP_NETWORK_SSID', backupSSID)}
${generate_script_variable('BACKUP_SSID_HASH', generate_WPA2_hash_command(backupSSID, backupPassword))}`;
    }
    scriptVariables += `
### End Script Variables ###
`;
    return scriptVariables;
}

function generate_WPAE_hash_command(password) {
    const primarySSIDHash = `$(echo -n "${password}" | iconv -t utf16le | openssl md4 -provider legacy | awk '{print $NF}')`;
    return primarySSIDHash;
}

function generate_WPA2_hash_command(ssid, password) {
    const backupSSIDHash = `$(wpa_passphrase "${ssid}" "${password}" | grep -oP '^\\s*psk=\\K\\S+')`;
    return backupSSIDHash;
}

function generate_WPA_supplicant_config(has_backup_network) {
    let config = '';
    config += BASE_WPA_CONF;
    if (has_backup_network) {
        config += EXTRA_WPA_CONF;
    }
    const finalScript = `
### WPA Supplicant Configuration ###

# Write to wpa_supplicant.conf
sudo tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null <<EOF
${config}

EOF

#Correctly set file permissions for wpa_supplicant.conf
sudo chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf

#Unblock wifi
sudo rfkill unblock wifi
for filename in /var/lib/systemd/rfkill/*:wlan ; do
    echo 0 > $filename
done

#Edit wpa_supplicant.service to use our config
sudo sed -i 's|^ExecStart=.*|ExecStart=/sbin/wpa_supplicant -u -s -O "DIR=/run/wpa_supplicant GROUP=netdev" -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf|' /lib/systemd/system/wpa_supplicant.service


#Write to DHCP config
${DHCP_CONFIG}

### End WPA Supplicant Configuration ###

`;
    return finalScript;
}

function generate_systemCTL() {
    return SYSTEMTL_COMMANDS;
}

function generate_arbitrary_file(filename,desciption,content) {
    return `
#Creating $FIRSTUSERHOME/pi_script_utilities/${filename}
#${desciption}
touch $FIRSTUSERHOME/pi_script_utilities/${filename}
sudo tee $FIRSTUSERHOME/pi_script_utilities/${filename} > /dev/null <<EOF
${content}
EOF
sudo chown $FIRSTUSER:$FIRSTUSER $FIRSTUSERHOME/pi_script_utilities/${filename}
sudo chmod 600 $FIRSTUSERHOME/pi_script_utilities/${filename}
`;
}

function generate_arbitrary_file_RAW(filename,desciption,content) {
    return `
#Creating $FIRSTUSERHOME/pi_script_utilities/${filename}
#${desciption}
touch $FIRSTUSERHOME/pi_script_utilities/${filename}
sudo tee $FIRSTUSERHOME/pi_script_utilities/${filename} > /dev/null <<'EOF'
${content}
EOF
sudo chown $FIRSTUSER:$FIRSTUSER $FIRSTUSERHOME/pi_script_utilities/${filename}
sudo chmod 600 $FIRSTUSERHOME/pi_script_utilities/${filename}
`;
}

function generate_puship_service_file() {
    const desciption = 'This file is the service for the pushIP service'
    const filepath = '/etc/systemd/system/pushIP.service'
    const content = `[Unit]
Description=service for the pushIP service
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=900

[Service]
Type=oneshot
ExecStart=$FIRSTUSERHOME/pi_script_utilities/pushIP.sh
User=$FIRSTUSER
Restart=on-failure
RestartSec=30
StartLimitBurst=20


[Install]
WantedBy=multi-user.target
`
    return `
#Creating ${filepath}
#${desciption}
touch ${filepath}
sudo tee ${filepath} > /dev/null <<EOF
${content}
EOF
sudo chmod 644 ${filepath}
`
}

function generate_puship_timer_file() {
    const desciption = 'This file is the timer for the pushIP service'
    const filepath = '/etc/systemd/system/pushIP.timer'
    const content = `[Unit]
Description=Timer for the pushIP service

[Timer]
# Run at startup after a delay
OnBootSec=20s
# Then every 15 minutes
OnUnitActiveSec=15min
Unit=pushIP.service

[Install]
WantedBy=timers.target
`

    return `
#Creating ${filepath}
#${desciption}
touch ${filepath}
sudo tee ${filepath} > /dev/null <<EOF
${content}
EOF
sudo chmod 644 ${filepath}
`
}



function generate_utility_files(ip_push_url) {

    const successFile = generate_arbitrary_file('setup_success.txt','This file is indicates successful setup','Setup completed successfully.');

    const networkManagerSwitch = generate_arbitrary_file('switch_to_networkmanager.sh','This file switches to NetworkManager',UTILITY_SWITCH_TO_NETWORKMANAGER);

    const wpaSupplicantSwitch = generate_arbitrary_file('switch_to_wpa_supplicant.sh','This file switches to wpa_supplicant',UTILITY_SWITCH_TO_WPASUPP);

    const ipPushScript = generate_arbitrary_file_RAW('pushIP.sh','This file pushes the IP to the server',PUSH_IP_SCRIPT)

    const ipPushUrlFile = generate_arbitrary_file_RAW('ip_endpoint','This file contains the URL to push the IP to',ip_push_url)

    const serviceFile = generate_puship_service_file();
    const timerFile = generate_puship_timer_file();

    return `
### Utility Files ###
FIRSTUSER=$(getent passwd 1000 | cut -d: -f1)
FIRSTUSERHOME=$(getent passwd 1000 | cut -d: -f6)

#Create directory for utility scripts and set permissions
sudo mkdir -p $FIRSTUSERHOME/pi_script_utilities

${successFile}

${networkManagerSwitch}
sudo chmod +x $FIRSTUSERHOME/pi_script_utilities/switch_to_networkmanager.sh

${wpaSupplicantSwitch}
sudo chmod +x $FIRSTUSERHOME/pi_script_utilities/switch_to_wpa_supplicant.sh

${ipPushUrlFile}

${ipPushScript}
sudo chmod +x $FIRSTUSERHOME/pi_script_utilities/pushIP.sh

${serviceFile}

${timerFile}

sudo systemctl enable pushIP.timer

### End Utility Files ###
`;
}


function generate_master_script (primarySSID, backupSSID, domain, username, password, backupPassword, ip_push_url) {
    let script = `
######## Injected Setup #######
`;
    script += generate_WPA_script_variables(primarySSID, backupSSID, domain, username, password, backupPassword);
    script += generate_WPA_supplicant_config(backupSSID && backupPassword);
    script += generate_systemCTL();
    script += generate_utility_files(ip_push_url);
    script += `
######## End Injected Setup #######
`;
    return script;
}

function inject_script(source, inject_content) {
    // Find the index of the line containing 'rm -f /boot/firstrun.sh'
    const rmLineIndex = source.indexOf('rm -f /boot/firstrun.sh');

    // If the line is found, insert the new lines above it
    if (rmLineIndex !== -1) {
        return source.slice(0, rmLineIndex) + inject_content + source.slice(rmLineIndex);
    } else {
        // If the line is not found, append the new lines at the end of the file
        return source + inject_content;
    }
}

export { generate_master_script, inject_script };
