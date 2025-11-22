
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';
import { JsonLd } from '@/components/seo/json-ld';

const APP_NAME = "UGO AI Studio";
const APP_DESCRIPTION = "The All-in-One AI-Powered Content and Application Development Platform.";
const APP_URL = "https://ugoai-hub.vercel.app"; 

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "AI",
    "Autonomous Agents",
    "Workflow Builder",
    "App Generator",
    "Website Builder",
    "Video Generator",
    "Next.js",
    "React",
    "Tailwind CSS",
  ],
  manifest: '/manifest.json',
  verification: {
    google: "W3MpZ-n3f__nszkbbn7M_8K2F8fttcYJTqwkJrwfX8o",
    other: {
      "msvalidate.01": "63A610B3C9552E33F88103CB9AD8CF70",
    }
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{
      url: `https://image2url.com/images/1763841110791-89d33076-5ae1-4795-a944-59a961ecd49a.gif`, 
      width: 1200,
      height: 630,
      alt: APP_NAME,
    }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ugoyoungking", 
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`https://image2url.com/images/1763841110791-89d33076-5ae1-4795-a944-59a961ecd49a.gif`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#673AB7" },
    { media: "(prefers-color-scheme: dark)", color: "#8B5CF6" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://image2url.com/images/1763840976823-7f54db93-cbce-4a23-a3ce-241521176f07.jpg" type="image/png" />
        <link rel="apple-touch-icon" href="https://image2url.com/images/1763840976823-7f54db93-cbce-4a23-a3ce-241521176f07.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
        <JsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                  }).catch(error => {
                    console.error('Service Worker registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
