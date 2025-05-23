import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'Fotrfix',
  description: 'Fotrfix.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Chatbot',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Disable auto-zoom on mobile Safari
  height: 'device-height',
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0 0% 100%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240deg 10% 3.92%)' },
  ],
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chatbot" />
        
        {/* Keyboard visibility detection script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Set initial viewport height
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
                
                // Detect virtual keyboard
                let initialHeight = window.innerHeight;
                let isKeyboardVisible = false;
                
                window.addEventListener('resize', function() {
                  // If height reduced significantly, keyboard is likely visible
                  if (window.innerHeight < initialHeight * 0.75) {
                    if (!isKeyboardVisible) {
                      isKeyboardVisible = true;
                      document.documentElement.classList.add('keyboard-visible');
                      document.body.classList.add('keyboard-visible');
                      
                      // Set a timeout to allow scrolling after the keyboard has fully appeared
                      setTimeout(() => {
                        const activeElement = document.activeElement;
                        if (activeElement) {
                          activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                      }, 300);
                    }
                  } else {
                    if (isKeyboardVisible) {
                      isKeyboardVisible = false;
                      document.documentElement.classList.remove('keyboard-visible');
                      document.body.classList.remove('keyboard-visible');
                      
                      // Update vh variable when keyboard closes
                      vh = window.innerHeight * 0.01;
                      document.documentElement.style.setProperty('--vh', vh + 'px');
                    }
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
