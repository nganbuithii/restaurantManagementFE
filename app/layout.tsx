'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import store from './store';
import { Provider } from 'react-redux';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import dynamic from "next/dynamic";
const GoogleOAuthProvider = dynamic(
  () => import('@react-oauth/google').then(mod => mod.GoogleOAuthProvider),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="referrer" content="origin"></meta>
      <body>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            {children}
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
