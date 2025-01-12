import Link from "next/link";
import Sidebar from "./Sidebar"; // Import your Sidebar component

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />
      
      {/* Form Content on the right */}
      <section className="w-full max-w-full flex-start flex-col ml-64"> {/* Adjust this margin if the sidebar is not 64px */}
        <h1 className="head_text text-left">
          <span className="blue_gradient">{type} Post</span>
        </h1>
        <p className="desc text-left max-w-md">
          {type} and share amazing stuff. Here is a text that is a bit longer to see how it looks.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
        >
          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
              Your Prompt is here
            </span>

            <textarea
              value={post.prompt}
              onChange={(e) => setPost({ ...post, prompt: e.target.value })}
              placeholder="Write your feedback here..."
              required
              className="form_textarea"
            />
          </label>

          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
              Tag{" "}
              <span className="font-normal"> (#product, #webdev #idea)</span>
            </span>

            <input
              value={post.tag}
              onChange={(e) => setPost({ ...post, tag: e.target.value })}
              placeholder="#tag"
              required
              className="form_input"
            />
          </label>

          <div className="flex-end mx-3 mb-5 gap-4">
            <Link href="/" className="text-gray-500 text-sm">
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
            >
              {submitting ? `${type}...` : type}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Form;
