import { ReactNode } from 'react';
import Navbar from './navbar.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <main className="container mr-auto px-4 py-8 ml-[10vw]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
