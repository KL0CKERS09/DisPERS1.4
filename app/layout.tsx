
import "./globals.css";
import AnnouncementNotifier from "./home-components/AlertNotificationWatcher";

export const metadata = {
  title: 'DisPERS | Web Alert System',
  icons: {
    icon: '/logoo 1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
        <AnnouncementNotifier />
      </body>
    </html>
  );
}
