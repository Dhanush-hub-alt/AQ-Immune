// Mobile App Entry Point
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import App from './App';

export default function Index() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <App />
    </>
  );
}
