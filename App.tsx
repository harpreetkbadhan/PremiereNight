import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

// entry point
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

// for future reference if we need to add global providers:
// - error boundary
// - query client (if we add react-query)