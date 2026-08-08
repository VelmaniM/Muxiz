import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root html layout for web in Expo Router.
 */
export default function RootLayoutHTML({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Muxiz - Music Player & Stream</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <ScrollViewStyleReset />
        <style>{`
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
      <body>{children}</body>
    </html>
  );
}
