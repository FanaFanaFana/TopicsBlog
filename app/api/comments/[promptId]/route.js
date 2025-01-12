import Comment from '@models/comment';
import { connectToDB } from '@utils/database';

// Handle GET requests
export const GET = async (request, { params }) => {
  const { promptId } = params;

  if (!promptId) {
    return new Response(JSON.stringify({ error: 'Prompt ID is required' }), { status: 400 });
  }

  try {
    await connectToDB();

    // Fetch all comments for the given promptId, and include replies by recursively querying the parentId
    const comments = await Comment.find({ promptId, parentId: null }) // Fetch top-level comments
      .populate('author', 'username image')
      .lean();

    // Fetch replies for each comment and nest them under their parent
    const addReplies = async (comments) => {
      return await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.find({ parentId: comment._id })
            .populate('author', 'username image')
            .lean();

          comment.replies = replies.length ? replies : [];
          comment.replies = await addReplies(comment.replies); // Recursive call to add replies to replies
          return comment;
        })
      );
    };

    const nestedComments = await addReplies(comments); // Add replies to all comments

    return new Response(JSON.stringify(nestedComments), { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), { status: 500 });
  }
};

// Handle POST requests
export const POST = async (request, { params }) => {
  const { promptId } = params;

  if (!promptId) {
    return new Response(JSON.stringify({ error: 'Prompt ID is required' }), { status: 400 });
  }

  try {
    const { text, authorId, parentId } = await request.json();

    if (!text || !authorId) {
      return new Response(
        JSON.stringify({ error: 'Both text and author ID are required' }),
        { status: 400 }
      );
    }

    await connectToDB();

    const newComment = new Comment({
      promptId,
      text: text.trim(),
      author: authorId,
      parentId: parentId || null, // Set parentId for replies
    });

    await newComment.save();
    await newComment.populate('author', 'username image');

    // After saving, fetch and add the replies for this comment (if it's a reply)
    if (parentId) {
      const parentComment = await Comment.findById(parentId).populate('author', 'username image');
      parentComment.replies = parentComment.replies || [];
      parentComment.replies.push(newComment);
      await parentComment.save(); // Save updated parent comment with the new reply
    }

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to post comment' }), { status: 500 });
  }
};
