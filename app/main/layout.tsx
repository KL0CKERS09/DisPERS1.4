
import Footer from "../home-components/Footer";
import Navbar from "../home-components/navbar";
import "./globals.css";



export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <div>
      <Navbar />
        {children}
            <Footer  />
      </div>

  );
}