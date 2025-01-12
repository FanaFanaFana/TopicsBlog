'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image'; // Correctly using Next.js Image

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      {/* Desktop Navigation */}
      <div className="sm:flex hidden justify-between w-full">
        {/* Left Section: Nav Logo */}
        <Link href="/" className="flex gap-2 flex-center">
          <p className="text-neutral-700 text-3xl font-bold"></p>
        </Link>

        {/* Right Section: Auth buttons */}
        <div className="flex gap-3 md:gap-5 items-center">
          {session?.user ? (
            <div className="flex gap-3 md:gap-5 items-center">
              <Link href="/create-prompt" className="black_btn">
                Create Post
              </Link>

              <button type="button" onClick={signOut} className="outline_btn">
                Sign Out
              </button>

              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Image
                    src={session?.user.image || '/default-avatar.png'} // Fallback image
                    width={37}
                    height={37}
                    className="rounded-full"
                    alt="Profile"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              {providers &&
                Object.values(providers).map((provider) => (
                  <div key={provider.name} className="flex items-center gap-2">
                    {provider.name === 'Google' ? (
                      <button
                        type="button"
                        onClick={() => signIn(provider.id)}
                        className="flex items-center bg-white px-4 py-2 rounded shadow text-gray-800 font-medium hover:bg-gray-100"
                      >
                        <Image
                          src="/assets/icons/google-icon.png"
                          alt="Google logo"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Google
                      </button>
                    ) : (
                      <button type="button" onClick={() => signIn(provider.id)} className="black_btn">
                        Sign in
                      </button>
                    )}
                  </div>
                ))}
              <Link href="/register" className="black_btn">
                Create Account
              </Link>
            </div>
          )}

          {/* Icon Always Visible */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/test.ico"
              alt="Home logo"
              width={37}
              height={37}
              className="rounded-full ml-2" // Adds space between the profile and logo
            />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex items-center">
            <Image
              src={session?.user.image || '/default-avatar.png'} // Fallback image
              width={37}
              height={37}
              className="rounded-full"
              alt="Profile"
            />
            {/* Dropdown for mobile */}
            <div className="dropdown">
              <Link href="/profile" className="dropdown_link">
                My Profile
              </Link>
              <Link href="/create-prompt" className="dropdown_link">
                Create Prompt
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="mt-5 w-full black_btn"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} className="flex items-center gap-2">
                  {provider.name === 'Google' ? (
                    <button
                      type="button"
                      onClick={() => signIn(provider.id)}
                      className="flex items-center bg-white px-4 py-2 rounded shadow text-gray-800 font-medium hover:bg-gray-100"
                    >
                      <Image
                        src="/assets/icons/google-icon.png"
                        alt="Google logo"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Google
                    </button>
                  ) : (
                    <button type="button" onClick={() => signIn(provider.id)} className="black_btn">
                      Sign in
                    </button>
                  )}
                </div>
              ))}
            <Link href="/register" className="black_btn">
              Create Account
            </Link>
          </div>
        )}

        {/* Icon Always Visible for Mobile */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/test.ico"
            alt="Home logo"
            width={37}
            height={37}
            className="rounded-full ml-2" // Adds space between the profile and logo
          />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
