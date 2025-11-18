import React from 'react';
import AppNavigation from './src/Navigation/AppNavigation';
import { CryptoProvider } from './src/components/Logic/CryptoHook';

const App = () => {
  return (
    <>
      <CryptoProvider>
        <AppNavigation />
      </CryptoProvider>
    </>
  );
};

export default App;