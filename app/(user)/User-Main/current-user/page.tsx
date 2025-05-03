'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserProfile = {
  _id: string;
  email: string;
  username: string;
  profilePicture: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched user:", data); // <-- Add this line
          setUser(data);
        } else {
          router.replace('/404');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);


  if (loading) return <div>Loading profile...</div>;
  if (!user) return null;

  return (
    <div className="w-full h-fit py-5 bg-[#ccb]">
      <div className="w-[80%] mx-auto flex justify-end items-center gap-4">
        <Link href={'/User-Main/profile-account'}>
          <div className='flex justify-center items-center gap-3'>
          <div className="w-16 h-16 relative rounded-full overflow-hidden border">
            {user.profilePicture && user.profilePicture.startsWith('data:image') ? (
              <img
                src={user.profilePicture}
                alt="Profile Picture"
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-bold">{user.username}</p>
            <p className="text-xs">{user.email}</p>
          </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
