'use client';

import Feed from '@components/Feed';
import Sidebar from '@components/Sidebar';
import TagList from '@components/TagList'; // Import the TagList component
import { useState } from 'react';

const Home = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [showTagList, setShowTagList] = useState(false); // State to toggle visibility of TagList

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
  };

  const toggleTagList = () => {
    setShowTagList(!showTagList); // Toggle visibility of the TagList
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-5">
      <div className="flex w-full h-full">

        {/* Left Sidebar */}
        <Sidebar
          onTagClick={handleTagClick}
          toggleTagList={toggleTagList}
          showTagList={showTagList}
        />

        {/* Main content area */}
        <div className="flex-1 ml-64 mr-64 p-5">
          <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 className="text-4xl font-extrabold text-center text-white mb-4">
              Timeless
              <br className="hidden md:block" />
              <span className="text-neutral-400">Topics</span>
            </h1>
            <p className="text-center text-lg text-white mb-6">
              Dive into a world of endless curiosity and exploration! Here, we cover everything under the sun—from science and technology to arts, culture, travel, lifestyle, and more.
              Stay tuned for engaging stories, expert insights, and fresh perspectives that make you think, smile, and discover. No matter the topic, we aim to deliver content that’s both insightful and entertaining.
              Join us on this journey through the limitless wonders of the world—because there's always more to know, share, and celebrate!
            </p>
          </div>

          {/* Feed */}
          <div className="mt-8 w-full max-w-2xl">
            <Feed selectedTag={selectedTag} />
          </div>
        </div>
      </div>

      {/* Right Sidebar for TagList */}
      {showTagList && (
        <aside className="fixed right-0 top-0 h-full w-64 bg-gray-800 p-4 shadow-lg">
          <h2 className="text-3xl text-slate-500 font-bold mb-4">Tags</h2>
          <TagList onTagClick={handleTagClick} />
        </aside>
      )}
    </section>
  );
};

export default Home;
