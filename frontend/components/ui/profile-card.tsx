'use client';

import Image from 'next/image';

interface ProfileCardProps {
  fullName: string;
  email: string;
  profileImage: string;
}

export function ProfileCard({ fullName, email, profileImage }: ProfileCardProps) {
  return (
    <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md'>
      <div className='flex flex-col items-center'>
        <Image
          src={profileImage}
          alt='Profile Image'
          width={100}
          height={100}
          className='rounded-full mb-4 border-2 border-gray-300'
        />
        <h2 className='text-xl font-semibold mb-1'>{fullName}</h2>
        <p className='text-gray-600'>{email}</p>
      </div>
    </div>
  );
}