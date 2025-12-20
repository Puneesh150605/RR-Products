import { createTheme } from '@mui/material/styles';

function getCssVars(mode) {
  if (mode === 'dark') {
    return {
      '--rr-body-bg':
        'radial-gradient(circle at 15% 10%, rgba(109,40,217,0.18), transparent 40%), radial-gradient(circle at 85% 25%, rgba(5,150,105,0.12), transparent 45%), linear-gradient(135deg, #0B1220 0%, #11102A 45%, #0B1220 100%)',
      '--rr-body-glow':
        'radial-gradient(circle at 20% 20%, rgba(109,40,217,0.16) 0%, transparent 45%), radial-gradient(circle at 80% 35%, rgba(5,150,105,0.10) 0%, transparent 45%)',
      '--rr-hero-bg': 'linear-gradient(135deg, rgba(109,40,217,0.20) 0%, rgba(10,14,20,0.88) 55%, rgba(5,150,105,0.12) 100%)',
      '--rr-parts-bg': 'linear-gradient(120deg, rgba(16,27,51,0.92) 0%, rgba(11,18,32,0.92) 100%)',
      '--rr-gradient': 'linear-gradient(135deg, #6D28D9 0%, #D946EF 55%, #059669 100%)',
    };
  }
  return {
    '--rr-body-bg':
      'radial-gradient(circle at 15% 10%, rgba(109,40,217,0.12), transparent 40%), radial-gradient(circle at 85% 25%, rgba(5,150,105,0.10), transparent 45%), linear-gradient(135deg, #F7F7FB 0%, #F3F0FF 45%, #F7F7FB 100%)',
    '--rr-body-glow':
      'radial-gradient(circle at 20% 20%, rgba(109,40,217,0.14) 0%, transparent 45%), radial-gradient(circle at 80% 35%, rgba(5,150,105,0.10) 0%, transparent 45%), radial-gradient(circle at 55% 90%, rgba(217,70,239,0.08) 0%, transparent 45%)',
    '--rr-hero-bg': 'linear-gradient(135deg, rgba(109,40,217,0.10) 0%, rgba(255,255,255,0.88) 45%, rgba(5,150,105,0.08) 100%)',
    '--rr-parts-bg': 'linear-gradient(120deg, rgba(255,255,255,0.85) 0%, rgba(236,241,255,0.85) 60%, rgba(255,255,255,0.92) 100%)',
    '--rr-gradient': 'linear-gradient(135deg, #6D28D9 0%, #D946EF 55%, #059669 100%)',
  };
}

export function createAppTheme(mode = 'light') {
  const isDark = mode === 'dark';
  const cssVars = getCssVars(mode);

  return createTheme({
    palette: {
      mode,
      background: isDark
        ? { default: '#0B1220', paper: '#121A2B' }
        : { default: '#F7F7FB', paper: '#FFFFFF' },
      primary: {
        main: isDark ? '#8B5CF6' : '#6D28D9',
        dark: isDark ? '#6D28D9' : '#5B21B6',
        light: isDark ? '#A78BFA' : '#8B5CF6',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#34D399' : '#059669',
        dark: isDark ? '#059669' : '#047857',
        light: isDark ? '#6EE7B7' : '#34D399',
        contrastText: '#FFFFFF',
      },
      info: { main: isDark ? '#F472B6' : '#DB2777', contrastText: '#FFFFFF' },
      success: { main: isDark ? '#34D399' : '#16A34A', dark: isDark ? '#059669' : '#15803D', contrastText: '#FFFFFF' },
      warning: { main: isDark ? '#FBBF24' : '#F59E0B', dark: isDark ? '#D97706' : '#D97706', contrastText: '#111827' },
      error: { main: isDark ? '#FB7185' : '#E11D48' },
      text: isDark ? { primary: '#F4F7FF', secondary: '#B8C2D3' } : { primary: '#0B1220', secondary: '#516173' },
      divider: isDark ? 'rgba(34,108,255,0.18)' : 'rgba(30,91,255,0.14)',
    },
    shape: { borderRadius: 16 },
    shadows: [
      'none',
      isDark ? '0 2px 10px rgba(0,0,0,0.35)' : '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)',
      isDark ? '0 6px 18px rgba(0,0,0,0.40)' : '0 4px 10px rgba(16,24,40,0.10)',
      isDark ? '0 12px 32px rgba(0,0,0,0.55)' : '0 10px 24px rgba(16,24,40,0.12)',
      isDark ? '0 18px 48px rgba(0,0,0,0.60)' : '0 16px 40px rgba(16,24,40,0.16)',
      isDark ? '0 20px 60px rgba(0,0,0,0.65)' : '0 22px 60px rgba(16,24,40,0.18)',
      ...Array.from({ length: 19 }, () => (isDark ? '0 18px 48px rgba(0,0,0,0.60)' : '0 16px 40px rgba(16,24,40,0.16)')),
    ],
    typography: {
      fontFamily: 'Inter, Poppins, Roboto, -apple-system, sans-serif',
      fontWeightBold: 900,
      h1: { fontWeight: 900, fontSize: '3.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 },
      h2: { fontWeight: 900, fontSize: '2.75rem', letterSpacing: '-0.01em' },
      h3: { fontWeight: 800, fontSize: '2rem' },
      h4: { fontWeight: 800, fontSize: '1.75rem' },
      h5: { fontWeight: 800, fontSize: '1.5rem' },
      h6: { fontWeight: 700, fontSize: '1.25rem' },
      button: { textTransform: 'none', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.2px' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': cssVars,
          body: { background: 'var(--rr-body-bg)', minHeight: '100vh' },
          'body::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: 'var(--rr-body-glow)',
          },
          '#root': { position: 'relative', zIndex: 1 },
          '::selection': { background: isDark ? 'rgba(34,108,255,0.35)' : 'rgba(30,91,255,0.18)' },
          '::-webkit-scrollbar': { width: 10, background: isDark ? '#0a0e14' : '#ECF1FF' },
          '::-webkit-scrollbar-thumb': { background: isDark ? 'rgba(34,108,255,0.32)' : 'rgba(30,91,255,0.22)', borderRadius: 10 },
          '::-webkit-scrollbar-thumb:hover': { background: isDark ? 'rgba(34,108,255,0.5)' : 'rgba(30,91,255,0.35)' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.55)' : '0 10px 30px rgba(16,24,40,0.10)',
            border: isDark ? '1px solid rgba(34,108,255,0.14)' : '1px solid rgba(30,91,255,0.10)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 800,
            paddingLeft: 22,
            paddingRight: 22,
            textTransform: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:active': { transform: 'translateY(1px)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: isDark ? '1px solid rgba(34,108,255,0.14)' : '1px solid rgba(30,91,255,0.12)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(10, 14, 20, 0.35)' : 'rgba(255,255,255,0.86)',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(34,108,255,0.5)' : 'rgba(30,91,255,0.45)' },
          },
          notchedOutline: { borderColor: isDark ? 'rgba(34,108,255,0.22)' : 'rgba(30,91,255,0.18)' },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 800, borderRadius: 999 } } },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border: isDark ? '1px solid rgba(34,108,255,0.18)' : '1px solid rgba(30,91,255,0.16)',
          },
        },
      },
    },
  });
}

export default createAppTheme('light');
