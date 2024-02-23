import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import { AlertContext } from './AlertProvider';

function FirstRunUpload({selectedFile, setSelectedFile}) {
    const [dragging, setDragging] = useState(false); // NEW STATE
    const { showAlert } = React.useContext(AlertContext);

    const setWithfilterFile = (file) => {
        // if no file
        if (!file) {
            return;
        }

        if (file.name === 'firstrun.sh') {
            setSelectedFile(file);
        } else {
            showAlert("error",'Only firstrun.sh file is allowed', null);
        }
    }

    const handleFileUpload = (event) => {
        setWithfilterFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false); // RESET DRAGGING STATE
        if (event.dataTransfer.items) {
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    const file = event.dataTransfer.items[i].getAsFile();
                    if (file.name === 'firstrun.sh') {
                        setWithfilterFile(file);
                    } else {
                        showAlert("error",'Only firstrun.sh file is allowed', null);
                    }
                }
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true); // SET DRAGGING STATE
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragging(false); // RESET DRAGGING STATE
    };

    return (
        <Box 
            onDrop={handleDrop} 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave} // NEW EVENT HANDLER
            style={{ 
                height: '100px', 
                width: '100%',
                border: dragging ? '2px dashed red' : '1px dashed gray' // CHANGE BORDER STYLE BASED ON DRAGGING STATE
            }}
        >
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', padding: '10px' }}>
                <Typography variant="h6">Upload or Drag and Drop your firstrun.sh file</Typography>
                {selectedFile && <Typography variant="subtitle1" style={{ color: 'green', fontWeight: 'bold' }}>File: {selectedFile.name}</Typography>}
                <input
                    type="file"
                    id="fileUpload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".sh" // Only accept .sh files
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => document.getElementById('fileUpload').click()}
                    sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px'
                    }} 
                >
                    Upload
                </Button>
               
            </Box>
        </Box>
    );
}

export default FirstRunUpload;
