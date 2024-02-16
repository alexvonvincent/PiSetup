import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

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
                                        {instruction.image && <img src={instruction.image} alt="" style={{ maxWidth: '100%', marginTop: '10px' }} />}
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
