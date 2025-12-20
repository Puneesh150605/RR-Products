import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App, { AuthProvider } from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';
import { ColorModeContext } from './ColorModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Root() {
  const getInitialMode = () => {
    const saved = localStorage.getItem('rr_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('rr_theme_mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

root.render(<Root />);
