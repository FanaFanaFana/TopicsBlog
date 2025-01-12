'use client';

import { useState, useEffect, useRef } from 'react';

const TagList = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          throw new Error('Failed to fetch tags');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return <p>Loading tags...</p>;
  }

  const handleTagClick = (tagName) => {
    onTagClick(tagName);
  };

  const handleShowAllClick = () => {
    onTagClick(''); // Reset to show all posts
  };

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -100, behavior: 'smooth' }); // Scroll up by 100px
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 100, behavior: 'smooth' }); // Scroll down by 100px
    }
  };

  const visibleTags = tags.slice(0); // Increase visible tags to 12

  return (
    <div className="w-full relative flex flex-col items-center group bg-gray-800"> {/* Darker background added here */}
      {/* Show All button */}
      <button
        onClick={handleShowAllClick}
        className="bg-gray-700 text-slate-300 px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 mb-4 w-full"
      >
        Show All
      </button>

      {/* Scroll Arrows */}
      <div className="relative w-full max-h-[800px]"> {/* Increase height to 450px */}
        {/* Scroll up arrow */}
        <button
          onClick={scrollUp}
          className="scroll-arrow absolute top-0 left-1/2 transform -translate-x-1/2 text-slate-300 bg-gray-100 rounded-full p-3 hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100 rotate-180"
        >
          <img src="/assets/icons/arrow.png" alt="Scroll Up" className="w-8 h-8" />
        </button>

        {/* Tags list */}
        <div className="overflow-hidden max-h-[800px]">
          <ul
            ref={listRef}
            className="flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100 scroll-smooth"
            style={{ maxHeight: '800px', overflowY: 'auto' }}
          >
            {visibleTags.map((tag, index) => (
              <li
                key={index}
                onClick={() => handleTagClick(tag)}
                className="cursor-pointer bg-gray-700 hover:bg-indigo-700 text-slate-300 py-3 px-5 rounded-lg shadow-md mb-2 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Scroll down arrow */}
        <button
          onClick={scrollDown}
          className="scroll-arrow absolute bottom-0 left-1/2 transform -translate-x-1/2 text-slate-300 bg-gray-100 rounded-full p-3 hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100"
        >
          <img src="/assets/icons/arrow.png" alt="Scroll Down" className="w-8 h-8 transform " />
        </button>
      </div>
    </div>
  );
};

export default TagList;
