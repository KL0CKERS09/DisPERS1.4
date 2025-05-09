

import "./globals.css";
import AnnouncementNotifier from "./home-components/AlertNotificationWatcher";

export const metadata = {
  title: 'DisPERS | Disaster Reporting System',
  icons: {
    icon: '/logoo 1.png',
  },
};


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