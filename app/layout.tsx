

import "./globals.css";
import AnnouncementNotifier from "./home-components/AlertNotificationWatcher";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
            <AnnouncementNotifier />
      </body>
    </html>
  );
}