import AnnouncementSection from "@/app/home-components/AnnouncementSection";
import Link from "next/link";




export default function UserAnnouncement() {
    return (
        <>
            <div className="w-[100%] min-h-screen mx-auto flex">
                {/*<div className="w-[30%] mt-20">
                    <h1 className="font-bold text-2xl">Navigate To:</h1>
                    <ul className="py-5">
                        <li className="flex gap-2 py-4 ">
                            <Link href="/submit-report" className="hover:underline ">
                                Submit Report
                            </Link>
                        </li>
                        <li className="flex gap-2 py-4">
                            <Link href="/user-alert" className="hover:underline">Alerts</Link>
                        </li>
                        <li className="flex gap-2 py-4 pl-2 bg-[#F3775C] rounded-2xl">
                            <Link href="/announcements" className="hover:underline text-white">Announcements</Link>
                        </li>
                    </ul>
                </div>*/}
                <AnnouncementSection/>
            </div>
        </>
    );
}