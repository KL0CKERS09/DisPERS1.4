import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function Navbar() {
  return (
    <header className="w-full min-h-16 sticky top-0 bg-[#ffd2aeca] z-[999]">
      <div className="w-full m-auto py-5 px-4 grid [grid-template-columns:repeat(auto-fit,minmax(500px,1fr))] scale-[0.75]">
        <div className="flex items-center gap-3">
          <Image 
            src="/safe-net-logo.svg"
            alt="SafeNet Logo"
            height={70}
            width={70}
          />
          <Link href="/" className="flex flex-col">
            <span className={`${roboto.variable} font-bold text-3xl tracking-[2px] text-[#FF5632] relative`}>
              DisPERS
            </span>
            <span className="text-[#333] font-medium">
              BARANGGAY BAGONG SILANGAN ALERT SYSTEM
            </span>
          </Link>
        </div>

        <div className="min-h-16 w-full">
          <ul className="flex justify-end items-center gap-2 w-full h-full">
            {["Home", "About", "Contact"].map((label, index) => (
              <li key={label} className="relative group">
                <span className="absolute left-0 bottom-[-10px] h-[5px] w-0 bg-[#FF5632] transition-all duration-400 ease-in-out group-hover:w-full"></span>
                <Link
                  href={index === 0 ? "/" : `../${label.toLowerCase()}`}
                  className="text-xl px-7 py-2 text-gray-900 font-semibold hover:bg-orange-100 group-hover:text-[#d85700]"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="../Login"
                className="italic font-bold px-13 py-4 rounded-2xl text-xl text-white bg-[#4E709D] hover:bg-blue-500 hover:text-gray-200"
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
