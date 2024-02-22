import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

import Box from '@mui/material/Box';

function ImageBox(src_links) {
    const multiImage  = src_links.length > 1 
    if (multiImage) {
        return ImageMultiBox(src_links);
    }
    // displays image
    return (
    <Box
        component="img"
        sx={{
          width: '80%', // Full width on small screens
          maxWidth: { sm: 400, md: 600, lg: 800 }, // Max widths on different breakpoints
          height: 'auto',
          display: 'block',
          margin: 'xs',
        }}
        alt="You need to see this, load this somehow. Use another browser maybe"
        src={src_links[0]}
      />
    );
  }


function ImageMultiBox(src_links) {
    // displays images side by side
    return (
        <Box
            sx={{
                display: 'flex', // Use Flexbox layout
                flexDirection: 'row', // Arrange children in a row
                flexWrap: 'wrap', // Allow wrapping to the next line
                justifyContent: 'left', // Center items along the row
            }}
        >
            {src_links.map((src_link, index) => (
                <Box
                    component="img"
                    sx={{
                        width: '40%', // Full width on small screens
                        maxWidth: { sm: 400, md: 600, lg: 800 }, // Max widths on different breakpoints
                        height: 'auto',
                        display: 'block',
                        margin: '2px',
                        objectFit: 'contain', // This will maintain the aspect ratio
                    }}
                    alt="You need to see this, load this somehow. Use another browser maybe"
                    src={src_link}
                />
            ))}
        </Box>
    );
}


const InstructionsList = ({ instructions, title, currentStageID, stageID }) => {
    const isDisabled = currentStageID !== stageID;
    return (
        <div style={{ marginTop: '20px', marginBottom: '20px', opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto' }}>
            <div>
                <Typography variant="h4" style={{ textAlign: 'left' }}>{title}</Typography>
                <ol style={{ textAlign: 'left', paddingLeft: '0' }}>
                    {instructions.map((instruction, index) => (
                        <ListItem key={index} alignItems="flex-start" style={{ justifyContent: 'flex-start' }}>
                            <ListItemText
                                primary={<Typography variant="body1">{index + 1}. {instruction.text}</Typography>}
                                secondary={
                                    <>
                                        {instruction.image && ImageBox(instruction.image)}
                                        {instruction.component && React.createElement(instruction.component, instruction.componentProps)}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default InstructionsList;
