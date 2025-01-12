import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Comment = ({ comment, onReply, session }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await onReply(comment._id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="ml-4 mt-2 border-l-2 border-l-gray-300 pl-2" key={comment._id}>
      <p>
        <strong>
          <a
            href={`/profile/${comment.author?._id}?name=${comment.author?.username}`}
            className="text-blue-500 hover:underline"
          >
            {comment.author?.username || 'Anonymous'}
          </a>
        </strong>
        : {comment.text}
      </p>
      {session && (
        <button
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
      )}
      {showReplyForm && (
        <form className="mt-2" onSubmit={handleReplySubmit}>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            type="submit"
            className="mt-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Reply
          </button>
        </form>
      )}
      {comment.replies?.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          onReply={onReply}
          session={session}
        />
      ))}
    </div>
  );
};

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [upvotes, setUpvotes] = useState(post.votes?.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.votes?.downvotes || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${post._id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          setCommentsCount(data.length);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (isCommentsVisible) fetchComments();
  }, [post._id, isCommentsVisible]);

  const handleCommentSubmit = async (parentId = null, text = newComment) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${post._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          authorId: session?.user.id,
          parentId,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prev) => {
          if (!parentId) return [...prev, newCommentData];

          const addReply = (comments) =>
            comments.map((comment) => {
              if (comment._id === parentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentData],
                };
              }
              return {
                ...comment,
                replies: addReply(comment.replies || []),
              };
            });

          return addReply(prev);
        });
        setCommentsCount((prev) => prev + 1);
        setNewComment('');
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!session) return alert('You need to log in to vote.');

    try {
      const response = await fetch(`/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: post._id,
          userId: session.user.id,
          vote: voteType,
        }),
      });

      if (response.ok) {
        const { upvotes: updatedUpvotes, downvotes: updatedDownvotes } = await response.json();
        setUpvotes(updatedUpvotes);
        setDownvotes(updatedDownvotes);
      } else {
        console.error('Failed to register vote');
      }
    } catch (error) {
      console.error('Error registering vote:', error);
    }
  };

  // Format the creation date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'short', // Optional: e.g., "Mon"
    year: 'numeric', // e.g., "2025"
    month: 'short', // e.g., "Jan"
    day: 'numeric', // e.g., "12"
  });

  return (
    <div className="prompt_card relative p-4 border rounded-md bg-white">
      {/* Main Content */}
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src={post.creator?.image || '/default-avatar.png'}
            alt={`${post.creator?.username || 'User'}'s profile image`}
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <a
              href={`/profile/${post.creator._id}?name=${post.creator.username}`}
              className="font-satoshi font-semibold text-gray-900"
            >
              {post.creator.username}
            </a>
            <p className="font-inter text-sm text-gray-500">{post.creator.email}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 absolute right-5 top-5">{formattedDate}</div> {/* Adjusted the position */}
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {/* Voting Section */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center gap-4">
        <button
          className="flex items-center gap-1 text-gray-700 hover:text-green-500"
          onClick={() => handleVote('up')}
        >
          <Image src="/assets/images/like.png" alt="Upvote" width={30} height={30} />
          <span className="text-sm">{upvotes}</span>
        </button>
        <button
          className="flex items-center gap-1 text-gray-700 hover:text-red-500"
          onClick={() => handleVote('down')}
        >
          <Image src="/assets/images/dislike.png" alt="Downvote" width={30} height={30} />
          <span className="text-sm">{downvotes}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="comments-section mt-4">
        <div className="flex justify-between items-center">
          <h4 className="font-satoshi font-semibold text-gray-800">Comments</h4>
          <button
            className="text-sm text-gray-500 hover:text-gray-800"
            onClick={() => setIsCommentsVisible((prev) => !prev)}
          >
            {isCommentsVisible ? 'Hide Comments ▲' : 'Show Comments ▼'} ({commentsCount})
          </button>
        </div>
        {isCommentsVisible && (
          <div className="mt-2 space-y-2">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onReply={handleCommentSubmit}
                session={session}
              />
            ))}
          </div>
        )}
        {session && (
          <form className="mt-3 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(); }}>
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
