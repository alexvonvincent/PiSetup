import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import { Card, CardHeader, CardContent } from '@mui/material';
import { createScrollPoint } from '../utils/scrollUtils';


function WpaEnterprise(WpaDetails, toggleEnabled, onChange) {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return <Card>
        {createScrollPoint('wpaPrimary')}
        <CardHeader
            action={<FormControlLabel
                control={<Checkbox checked={WpaDetails.primaryEnabled} onChange={toggleEnabled} />}
                name="primaryEnabled"
                label="Use Primary" />}
            title={<Typography variant="h6" gutterBottom> WPA Enterprise Configuration </Typography>}
            sx={{ pb: 0 }} // Corrected syntax here
        />
        <CardContent sx={{ opacity: !WpaDetails.primaryEnabled ? 0.5 : 1, pointerEvents: !WpaDetails.primaryEnabled ? 'none' : 'inherit' }}>
            <TextField name="SSID" label="Primary SSID" variant="outlined" fullWidth margin="normal" required defaultValue={WpaDetails.SSID} onChange={onChange} />
            <TextField name="domain" label="Domain" variant="outlined" fullWidth margin="normal" required onChange={onChange} defaultValue={WpaDetails.domain} />
            <TextField name="username" label="Username" variant="outlined" fullWidth margin="normal" required onChange={onChange} defaultValue={WpaDetails.username} />
            <Box display="flex" flexDirection="row" alignItems="left">
                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                    onChange={onChange}
                    defaultValue={WpaDetails.password} />
                <FormControlLabel
                    control={<Checkbox checked={showPassword} onChange={togglePasswordVisibility} />}
                    label="Show Password"
                    sx={{ minWidth: 'fit-content', ml: 1 }} // Add this line
                />
            </Box>
        </CardContent>
    </Card>;
}

function WpaStandard(WpaDetails, toggleEnabled, onChange) {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return <Card>
        {createScrollPoint('wpaBackup')}
        <CardHeader
            action={<FormControlLabel
                control={<Checkbox checked={WpaDetails.backupEnabled} onChange={toggleEnabled} />}
                name="backupEnabled"
                label="Use Backup" />}
            title={<Typography variant="h6" gutterBottom> {`WPA 2 Configuration (backup)`} </Typography>}
            sx={{ pb: 0 }} // Corrected syntax here
        />
        <CardContent sx={{ opacity: !WpaDetails.backupEnabled ? 0.5 : 1, pointerEvents: !WpaDetails.backupEnabled ? 'none' : 'inherit' }}>
            <TextField name="backupSSID" label="Backup SSID (Optional)" variant="outlined" fullWidth margin="normal" onChange={onChange} defaultValue={WpaDetails.backupSSID} />
            <Box display="flex" flexDirection="row" alignItems="left">
                <TextField
                    name="backupPassword"
                    label="Backup Password (Optional)"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                    onChange={onChange}
                    defaultValue={WpaDetails.backupPassword}
                />
                <FormControlLabel
                    control={<Checkbox checked={showPassword} onChange={togglePasswordVisibility} />}
                    label="Show Password"
                    sx={{ minWidth: 'fit-content', ml: 1 }} // Add this line
                />
            </Box>
        </CardContent>
    </Card>;
}

function WpaForm({ WpaDetails, setWpaDetails }) {
    const toggleEnabled = (e) => {
        const curr = WpaDetails[e.target.name];
        setWpaDetails({ ...WpaDetails, [e.target.name]: !curr });
    };

    const onChange = (e) => {
        setWpaDetails({ ...WpaDetails, [e.target.name]: e.target.value });
        console.log(WpaDetails);
    }

    return (
        <Box component="form" id="configForm">
            {WpaEnterprise(WpaDetails, toggleEnabled, onChange)}
            {WpaStandard(WpaDetails, toggleEnabled, onChange)}
        </Box>
    );
}

export default WpaForm;

