'use client';

import { Suspense } from 'react'; // Import Suspense from React
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Profile from '@components/Profile';

const MyProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  // Extract the name from searchParams or fallback to session
  const userName = searchParams.get('name') || session?.user.name || session?.user.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user.id) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        if (response.ok) {
          const data = await response.json();
          setPosts(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch posts:', response.status);
        }
      } catch (error) {
        console.error('An error occurred while fetching posts:', error);
      }
    };

    fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const deleteConfirm = confirm('Are you sure you want to delete this prompt?');
    if (deleteConfirm) {
      try {
        const response = await fetch(`/api/prompt/${post._id}`, { method: 'DELETE' });
        if (response.ok) {
          setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
        } else {
          console.error('Failed to delete prompt:', response.status);
        }
      } catch (error) {
        console.error('An error occurred while deleting the prompt:', error);
      }
    }
  };

  return (
    <Profile
      name={userName}
      desc="Welcome to your profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

const MyProfileWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyProfile />
    </Suspense>
  );
};

export default MyProfileWrapper;
