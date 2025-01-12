import Prompt from '@/models/prompt'; // Correct path to your model
import { connectToDB } from '@/utils/database'; // Correct path to your database util

export async function POST(req) {
  try {
    await connectToDB();

    const { promptId, userId, vote } = await req.json();
    if (!promptId || !userId || !['up', 'down'].includes(vote)) {
      return new Response(
        JSON.stringify({ message: 'Invalid request parameters' }),
        { status: 400 }
      );
    }

    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return new Response(JSON.stringify({ message: 'Prompt not found' }), {
        status: 404,
      });
    }

    const existingVoteIndex = prompt.votes.voters.findIndex(
      (v) => v.userId.toString() === userId
    );

    let voteDelta = { upvotes: 0, downvotes: 0 };

    if (existingVoteIndex > -1) {
      const existingVote = prompt.votes.voters[existingVoteIndex];

      if (existingVote.vote === vote) {
        return new Response(
          JSON.stringify({ message: 'User already voted this way' }),
          { status: 400 }
        );
      }

      voteDelta[existingVote.vote === 'up' ? 'upvotes' : 'downvotes'] -= 1;
      prompt.votes.voters[existingVoteIndex].vote = vote;
    } else {
      prompt.votes.voters.push({ userId, vote });
    }

    voteDelta[vote === 'up' ? 'upvotes' : 'downvotes'] += 1;

    prompt.votes.upvotes += voteDelta.upvotes;
    prompt.votes.downvotes += voteDelta.downvotes;

    prompt.markModified('votes');
    await prompt.save();

    return new Response(
      JSON.stringify({
        upvotes: prompt.votes.upvotes,
        downvotes: prompt.votes.downvotes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling vote:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
