import Prompt from '@models/prompt';
import { connectToDB } from '@utils/database';

export const GET = async () => {
  try {
    await connectToDB();
    const prompts = await Prompt.find(); // Get all prompts

    // Extract unique tags from prompts
    const tags = [...new Set(prompts.map((prompt) => prompt.tag))]; // Using a Set to ensure unique tags
    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tags', details: error.message }),
      { status: 500 }
    );
  }
};
