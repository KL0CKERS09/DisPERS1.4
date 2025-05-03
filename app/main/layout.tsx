
import Footer from "../home-components/Footer";
import Navbar from "../home-components/navbar";
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Navbar />
        {children}
            <Footer  />
      </body>
    </html>
  );
}