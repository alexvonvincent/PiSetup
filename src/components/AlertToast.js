import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Alert2(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

export default function AlertToast({ open, handleClose, severity, message }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert2 onClose={handleClose} severity={severity}>
                {message}
            </Alert2>
        </Snackbar>
    );
}
