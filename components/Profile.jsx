import Sidebar from "./Sidebar"; // Import your Sidebar component
import PromptCard from './PromptCard';

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Profile Content on the right */}
      <section className="w-full max-w-full ml-64"> {/* Adjust this margin if the sidebar is not 64px */}
        <h1 className="head_text text-left">
          <span className="blue_gradient">{name}</span>
        </h1>
        <p className="desc text-left">{desc}</p>
        <div className="mt-10 prompt_layout">
          {data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
