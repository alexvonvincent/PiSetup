import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';

function WpaForm({WpaDetails, setWpaDetails}) {
    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };


    const onChange = (e) => {
        setWpaDetails({ ...WpaDetails, [e.target.name]: e.target.value });
        console.log(WpaDetails);
    }

    return (
        <Box component="form" id="configForm">
            <TextField name="SSID" label="Primary SSID" variant="outlined" fullWidth margin="normal" required defaultValue={WpaDetails.SSID} onChange={onChange} />
            <TextField name="domain" label="Domain" variant="outlined" fullWidth margin="normal" required onChange={onChange} defaultValue={WpaDetails.domain} />
            <TextField name="username" label="Username" variant="outlined" fullWidth margin="normal" required onChange={onChange} defaultValue={WpaDetails.username}/>
            <TextField
                name="password"
                label="Password"
                type={showPassword1 ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                required
                onChange={onChange}
                defaultValue={WpaDetails.password}
            />
            <FormControlLabel
                control={<Checkbox checked={showPassword1} onChange={togglePasswordVisibility1} />}
                label="Show Password"
            />
            <TextField name="backupSSID" label="Backup SSID (Optional)" variant="outlined" fullWidth margin="normal" onChange={onChange} defaultValue={WpaDetails.backupSSID} />
            <TextField
                name="backupPassword"
                label="Backup Password (Optional)"
                type={showPassword2 ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={onChange}
                defaultValue={WpaDetails.backupPassword}
            />
            <FormControlLabel
                control={<Checkbox checked={showPassword2} onChange={togglePasswordVisibility2} />}
                label="Show Password"
            />
        </Box>
    );
}

export default WpaForm;
