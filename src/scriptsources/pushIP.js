const content = String.raw`#!/bin/bash

# Define the interface
INTERFACE="wlan0"
WIFI_INTERFACE=$INTERFACE

# Run ifconfig for the specific interface
output=$(ifconfig $INTERFACE)

# Use grep and awk to parse the output and assign to variables
IP=$(echo "$output" | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | head -n 1)
NETMASK=$(echo "$output" | grep -oE "netmask [0-9\.]+" | awk '{print $2}')
BROADCAST=$(echo "$output" | grep -oE "broadcast [0-9\.]+" | awk '{print $2}')
ETHER=$(echo "$output" | grep -oE "ether [0-9a-f:]+" | awk '{print $2}')

WIFI_NETWORK=$(iwgetid $WIFI_INTERFACE -r)

# Print the variables
echo "Interface: $INTERFACE"
echo "IP: $IP"
echo "NETMASK: $NETMASK"
echo "BROADCAST: $BROADCAST"
echo "ETHER: $ETHER"
echo "Connected WiFi Network: $WIFI_NETWORK"

# Create a JSON string
json_string=$(echo -n "{\"ip\": \"$IP\", \"netmask\": \"$NETMASK\", \"broadcast\": \"$BROADCAST\", \"ether\": \"$ETHER\", \"wifi_network\": \"$WIFI_NETWORK\"}")

# Load the endpoint from a file
endpoint=$(cat ~/pi_script_utilities/ip_endpoint)

# Make a POST request with wget
response=$(wget --method=POST --body-data="$json_string" --header="Content-Type: application/json" --max-redirect=20 -O - "$endpoint")
echo "Response: $response"

if [ "$response" == "Cache updated successfully" ]; then
    exit 0
else
    exit 1
fi

`

export default content;
