import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Client entry point executing');
createRoot(document.getElementById('root')!).render(<App />);
