import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root html layout for web in Expo Router with fixed screen size & disabled user zoom.
 */
export default function RootLayoutHTML({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ backgroundColor: '#000000', colorScheme: 'dark' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <title>Muxiz - Music Player & Stream</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <ScrollViewStyleReset />
        <style>{`
          html, body, #root, #__next {
            background-color: #000000 !important;
            color-scheme: dark !important;
            margin: 0;
            padding: 0;
            touch-action: manipulation !important;
            -ms-touch-action: manipulation !important;
            -webkit-text-size-adjust: 100% !important;
            -moz-text-size-adjust: 100% !important;
            -ms-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
            overflow-x: hidden !important;
          }
          *:focus, *:focus-visible, *:focus-within, *:active {
            outline: none !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          button, a, input, textarea, div, span, [role="button"] {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
        `}</style>
      </head>
      <body style={{ backgroundColor: '#000000', margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
