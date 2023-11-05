'use client';

import { type ReactNode } from 'react';
import { getCurrentEnvironment } from '@src/network/relay/environment';
import { RelayEnvironmentProvider } from 'react-relay';

type Props = {
  children: ReactNode;
};

function RootClientLayout({ children }: Props) {
  const environment = getCurrentEnvironment();

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}

export default RootClientLayout;
