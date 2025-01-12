import Prompt from '@models/prompt';
import Comment from '@models/comment'; // Assuming you have a Comment model
import { connectToDB } from '@utils/database';

// GET - Fetch a single prompt and include comments count
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate('creator');
    if (!prompt) return new Response('Prompt not found', { status: 404 });

    // Count the number of comments associated with this prompt
    const commentsCount = await Comment.countDocuments({ promptId: params.id });

    // Return the prompt details along with comments count
    const response = {
      ...prompt.toObject(), // Convert Mongoose document to plain object
      commentsCount,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch prompt', { status: 500 });
  }
};

// PATCH - Update the prompt details
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt) return new Response('Prompt not found', { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to update prompt', { status: 500 });
  }
};

// DELETE - Delete a prompt
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndDelete(params.id);

    return new Response('Prompt deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete prompt', { status: 500 });
  }
};
