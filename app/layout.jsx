import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata = {
  title: "Topics",
  description: 'This is my page, check it out',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Add the favicon here */}
        <link rel="icon" href="/assets/images/test.ico" type="image/x-icon" />
      </head>
      <body>
        <Provider>
          <div className="main bg-slate-200 ">
            <div className="" />
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
