import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BenchmarkProvider } from './context/BenchmarkContext';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <ThemeProvider>
        <AuthProvider>
          <BenchmarkProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '14px',
                  padding: '16px',
                },
              }}
            />
          </BenchmarkProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
