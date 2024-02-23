import { createTheme } from '@mui/material/styles';

const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef1280',
    },
    secondary: {
      main: '#f50057',
    },
  },
};
const theme = createTheme(themeOptions);
export { theme }
