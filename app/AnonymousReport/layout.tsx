import Footer from "../home-components/Footer";
import Navbar from "../home-components/navbar";

import "./global.css";



export default function LogInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <>
    <Navbar />
        {children}
        <Footer  />
    </>
 
  );
}