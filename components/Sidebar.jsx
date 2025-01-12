'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import TagList from '@components/TagList';

const Sidebar = ({ onTagClick, toggleTagList, showTagList }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleNavigation = (path) => {
    router.push(path); // Navigate to the respective page
  };

  const isActive = (path) => {
    return router.pathname === path ? 'bg-gray-700' : ''; // Highlight the active link
  };

  return (
    <div className="sidebar bg-gray-800 text-white fixed h-full top-0 left-0 transition-all duration-300 ease-in-out">
      {/* Sidebar header (Logo) */}
      <div className="sidebar-header mb-8 px-4">
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            src="/assets/images/test.ico"
            alt="logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <p className="text-slate-300 text-2xl font-bold">Topics</p>
        </Link>
      </div>

      {/* Home Button */}
      <Link href="/" className="sidebar-link">
        Home
      </Link>

      {/* Sidebar links container */}
      <div className="sidebar-links-container flex flex-col justify-center flex-grow">
        <div className="sidebar-links space-y-6 px-4">
          <button
            onClick={toggleTagList} // Toggle TagList visibility
            className={`sidebar-link ${isActive('/categories')}`}
          >
            Categories
          </button>
          <button
            onClick={() => handleNavigation('/create-prompt')}
            className={`sidebar-link ${isActive('/create-prompt')}`}
          >
            Create New Post
          </button>
          <button
            onClick={() => handleNavigation('/find-user')}
            className={`sidebar-link ${isActive('/find-user')}`}
          >
            Find User
          </button>
          <button
            onClick={() => handleNavigation('/find-tag')}
            className={`sidebar-link ${isActive('/find-tag')}`}
          >
            Find by Tag
          </button>
        </div>
      </div>

      {/* Sidebar footer */}
      <div className="sidebar-footer mt-auto px-4">
        {session ? (
          <button onClick={() => signOut()} className="sidebar-link">
            Logout
          </button>
        ) : (
          <button onClick={() => handleNavigation('/login')} className="sidebar-link">
            Login
          </button>
        )}
      </div>

      {/* Right Sidebar for TagList */}
      {showTagList && (
        <aside className="fixed right-0 top-0 h-full w-64 bg-gray-800 p-4 shadow-lg transition-all ease-in-out duration-300">
          <h2 className="text-3xl text-slate-500 font-bold mb-4">Tags</h2>
          <TagList onTagClick={onTagClick} />
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
