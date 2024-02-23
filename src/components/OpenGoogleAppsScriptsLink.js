import React from 'react';
import { Button } from '@mui/material';

export const OpenGoogleAppsScriptsLink = () => {
  return (
    <Button variant="contained" color="primary" onClick={() => window.open('https://script.google.com', '_blank')}>
      Open Google Apps Scripts
    </Button>
  );
};
