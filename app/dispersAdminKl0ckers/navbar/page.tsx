'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Roboto } from 'next/font/google';
import styles from "../styles/navbar.module.scss"

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-roboto',
});

const navItems = [
    { name: 'Home', href: '/dispersAdminKl0ckers' },
    { name: 'Reports', href: '/dispersAdminKl0ckers/verifying-reports' },
    { name: 'Users', href: '/dispersAdminKl0ckers/user-data' },
    { name: 'Announcement', href: '/dispersAdminKl0ckers/announcement' },
    { name: 'Alerts', href: '/dispersAdminKl0ckers/alert' },
];

export default function NavbarAdmin() {
    const pathname = usePathname();



    return (
        <header className={` ${styles["main-header"]} w-full sticky top-0 bg-white shadow-md z-50`}>
            <div className={`${styles["backgroundImage"]}`}>
                <Image className='w-[100%]' src={`/1st-sec-1st-pic.jpg`} alt='' width={1000} height={10}></Image>
            </div>
            <div className={`${styles.content} w-[90%] m-auto scale-[.8]`}>
                <div className={`${styles.navbarGrid} w-full m-auto py-5 px-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <Image
                            src="/safe-net-logo.svg"
                            alt="SafeNet Logo"
                            width={70}
                            height={70}
                        />
                        <Link href="/dispersAdminKl0ckers" className="flex flex-col">
                            <span className={`${styles.logoTitle} ${roboto.variable} font-bold text-3xl text-black`}>DisPERS</span>
                            <span className={`${styles.logoSubTitle} text-white`}>Barangay Bagong Silangan Alert System</span>
                        </Link>
                    </div>

                    <nav>
                        <ul className="flex gap-6 items-center">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors bg-[#4E709D] text-white  ${pathname === item.href
                                                ? 'bg-orange-500 text-white'
                                                : 'text-gray-700 hover:bg-[#5a88c3]'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
