'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Correctly using the hook
import Form from '@components/Form';

const EditPrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');
  
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });
  const [loading, setLoading] = useState(true); // Adding a loading state

  // Fetch prompt details when the promptId changes
  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) {
        return; // Exit early if there's no promptId
      }
      
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();
        setPost({
          prompt: data.prompt,
          tag: data.tag,
        });
      } catch (error) {
        console.error("Error fetching prompt:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (promptId) {
      getPromptDetails(); // Fetch prompt details when the component is mounted or promptId changes
    }
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert('Prompt ID not found');

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
        headers: {
          'Content-Type': 'application/json', // Make sure content type is set to JSON
        },
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to update prompt');
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading UI while fetching
  }

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default EditPrompt;