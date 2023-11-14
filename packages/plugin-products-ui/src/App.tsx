import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@erxes/ui/src/styles/main';
import { AppProvider } from 'coreui/appContext';

import '@erxes/ui/src/styles/global-styles.ts';
import 'erxes-icon/css/erxes.min.css';
import '@erxes/ui/src/styles/style.min.css';

const App = () => {
  return (
    <AppProvider>
      <PluginLayout>
        <GeneralRoutes />
      </PluginLayout>
    </AppProvider>
  );
};

export default App;
