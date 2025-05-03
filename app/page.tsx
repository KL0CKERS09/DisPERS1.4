import HomePage from "./(main)/page";
import Footer from "./home-components/Footer";
import Navbar from "./home-components/navbar";



export default function Home() {
  return (
    <>
    <main className="relative">
      <Navbar/>
      <HomePage/>
      <Footer/>
      </main>
    </>
  );
}
