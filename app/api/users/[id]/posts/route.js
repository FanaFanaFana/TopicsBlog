import Prompt from '@models/prompt';
import { connectToDB } from '@utils/database';

export const GET = async (request, context) => {
	try {
		// Ensure params are awaited before using them
		const { id } = await context.params; // Await the params object

		// Connect to the database
		await connectToDB();

		// Fetch prompts for the specific user (creator)
		const prompts = await Prompt.find({ creator: id }).populate('creator');
		
		// Return the fetched prompts as a JSON response
		return new Response(JSON.stringify(prompts), { status: 200 });
	} catch (error) {
		// Handle any errors and send a response with status 500
		return new Response('Failed to fetch the user prompts', { status: 500 });
	}
};
