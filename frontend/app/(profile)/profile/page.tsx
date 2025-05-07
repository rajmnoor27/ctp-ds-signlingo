'use client';

import React, { useState, useEffect } from 'react';
import { ProfileCard } from '@/components/ui/profile-card';


const ProfilePage = () => {
  // Mocked user data (to be replaced with Firebase data)
  const [userData, setUserData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: ''
  });

  useEffect(() => {
    // Simulate fetching user data (will integrate with Firebase later)
    const fetchUserData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setUserData({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        profileImage: ''
      });
    };
    fetchUserData();
  }, []);

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <ProfileCard 
        fullName={userData.fullName} 
        email={userData.email} 
        profileImage={userData.profileImage} 
      />
    </div>
  );
};

export default ProfilePage;