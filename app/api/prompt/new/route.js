import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';
import User from '@models/user';
import mongoose from 'mongoose';

export const POST = async (req) => {
  try {
    const { userId, prompt, tag } = await req.json();
    console.log("Received data:", { userId, prompt, tag });

    if (!userId || !prompt || !tag) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await connectToDB();
    console.log("Database connected");

    // Check if userId is a valid MongoDB ObjectId
    let user;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      // Fallback to searching by `authProviderId` (e.g., for Google users)
      user = await User.findOne({ authProviderId: userId });
    }

    if (!user) {
      console.error("User not found for ID:", userId);
      return new Response(
        JSON.stringify({ error: "Invalid user ID" }),
        { status: 400 }
      );
    }

    console.log("User verified:", user);

    const newPrompt = new Prompt({
      creator: user._id, // Use the user's MongoDB ObjectId
      prompt,
      tag,
    });

    await newPrompt.save();
    console.log("Prompt created successfully");

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.error("Error creating a new prompt:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create a new prompt", details: error.message }),
      { status: 500 }
    );
  }
};
