/// <reference types="@devvit/public-api" />
import React from 'react';

export default function App() {
  React.useEffect(() => {
    console.log('Client App Mounted');
    // Notify server we are alive
    window.parent.postMessage({ type: 'initial_load', data: 'hello' }, '*');
  }, []);

  return <div style={{ color: 'black', background: 'yellow', padding: '20px', height: '100%' }}>Client loaded.</div>;
}
