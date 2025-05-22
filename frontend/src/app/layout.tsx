import type { Metadata } from 'next';

import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from 'store/ProviderWrapper';

export const metadata: Metadata = {
  title: 'Office Radio – AI-Powered Radio Management',
  description:
    'Manage AI-driven radio channels, upload music, and control DJ settings with the Office Radio admin panel. Built for artists and admins to automate and streamline 24/7 broadcasting using intelligent voice and music transitions.',
};

// ==============================|| ROOT LAYOUT ||============================== //

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
