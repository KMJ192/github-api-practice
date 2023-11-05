import type { Metadata } from 'next';
import RootClientLayout from '@src/client/layout';

import './globals.css';

export const metadata: Metadata = {
  title: 'Github Star',
  description: '',
};

function RootServerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}

export default RootServerLayout;
