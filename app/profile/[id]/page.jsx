'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Profile from '@components/Profile';

// Wrap the entire component inside Suspense to handle async operations
const UserProfile = ({ params: paramsPromise }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name');
  
  const params = use(paramsPromise);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}/posts`);
        const data = await response.json();

        // Ensure data is always an array
        setUserPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
        setUserPosts([]);
      }
    };

    if (params.id) fetchPosts();
  }, [params.id]);

  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <Profile
        name={userName}
        desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
        data={userPosts}
      />
    </Suspense>
  );
};

export default UserProfile;
