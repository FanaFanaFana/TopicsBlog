'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = ({ selectedTag }) => {
  const [allPosts, setAllPosts] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 4;

  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    // Sort posts by upvotes in descending order
    const sortedData = data.sort((a, b) => (b.votes?.upvotes || 0) - (a.votes?.upvotes || 0));
    setAllPosts(sortedData);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, 'i'); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) => regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
        setCurrentPage(1); // Reset to the first page when searching
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
    setCurrentPage(1); // Reset to the first page when filtering by tag
  };

  // Filter posts based on the selectedTag (or show all if no tag selected)
  const filteredPosts = selectedTag
    ? allPosts.filter((post) => post.tag === selectedTag)
    : allPosts;

  // Get current prompts for pagination
  const currentData = searchText
    ? searchedResults.slice((currentPage - 1) * promptsPerPage, currentPage * promptsPerPage)
    : filteredPosts.slice((currentPage - 1) * promptsPerPage, currentPage * promptsPerPage);

  const totalPages = Math.ceil(filteredPosts.length / promptsPerPage);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer ring-4 ring-offset-2"
        />
      </form>

      {/* Prompts */}
      <PromptCardList data={currentData} handleTagClick={handleTagClick} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white'
            }`}
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Feed;
