import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, CardActions } from '@mui/material';
import { CardHeader } from '@mui/material';
import pi_ip from '../scriptsources/pi_ip';

function CodeTemplateDisplay() {
    const [code, setCode] = useState('');

    useEffect(() => {
        // Fetch the code template upon component mount
        setCode(pi_ip)
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            //   alert('Code copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <Card sx={{ my: 2, position: 'relative' }}>
            <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <CardHeader title="Code.gs" />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={copyToClipboard}
                    color="secondary"
                    sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px'
                    }} 
                >
                    <Typography variant="button">
                        Copy Code
                    </Typography>
                </Button>
            </CardActions>
            <CardContent>
                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                    {code}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default CodeTemplateDisplay;
