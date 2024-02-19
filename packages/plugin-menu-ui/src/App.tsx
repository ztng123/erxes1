import React from 'react';
import GeneralRoutes from './generalRoutes';
import { AppProvider } from '../../core-ui/src/appContext';
import { PluginLayout } from '@erxes/ui/src/styles/main';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <PluginLayout>
          <GeneralRoutes />
        </PluginLayout>
      </AppProvider>
    </Router>
  );
};

export default App;
