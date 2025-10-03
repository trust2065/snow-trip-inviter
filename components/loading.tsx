import React from 'react';
import { ActivityIndicator } from 'react-native';
import CenteredScreen from './centered-screen';

export default function Loading({ bgColor }: { bgColor?: string; }) {
  return (
    <CenteredScreen backgroundColor={bgColor ?? '#fff'}>
      <ActivityIndicator size='large' />
    </CenteredScreen>
  );
}