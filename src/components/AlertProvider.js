import React, { createContext, useState } from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Dialog } from '@mui/material';

export const AlertContext = createContext();



function InnerAlert({ open, severity, message, closeAlert, cancelAlert, closable }) {
    if (closable){
        return (
            <Dialog open={open} onClose={closeAlert}>
                <Alert 
                    severity={severity} 
                >
                <AlertTitle>{severity.toUpperCase()}</AlertTitle>
                {message.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
                </Alert>
            </Dialog>
        );
    }
    return (
        <Dialog open={open}>
                <Alert 
                    severity={severity} 
                >
                <AlertTitle>{severity.toUpperCase()}</AlertTitle>
                {message.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
                <Button onClick={closeAlert}>Ok</Button>
                <Button onClick={cancelAlert}>Cancel</Button>
                </Alert>
            </Dialog>
    );
}

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '', post_action: null, closable: true});

    const showAlert = (severity, message, post_action, closable = true) => {
        setAlert({ open: true, severity: severity, message: message, post_action: post_action, closable: closable});
    };

    const closeAlert = () => {
        if (alert.post_action) {
            alert.post_action({});
        }
        setAlert({ ...alert, open: false, post_action: null});
    };

    const cancelAlert = () => {
        if (alert.post_action) {
            alert.post_action({cancelled: true});
        }
        setAlert({ ...alert, open: false, post_action: null});
    };


    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <InnerAlert 
                open={alert.open} 
                severity={alert.severity} 
                message={alert.message} 
                closeAlert={closeAlert}
                cancelAlert={cancelAlert}
                closable={alert.closable}
            />
        </AlertContext.Provider>
    );
}
