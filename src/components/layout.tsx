import { ReactNode, useEffect, useState } from "react";
import Navbar from "./navbar.tsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className={`
        flex-1 container max-w-screen-xl mx-auto px-4 py-8
        transition-all duration-300
        ${isMobile ? 'mt-12' : 'lg:ml-[10vw] sm:ml-24 md:px-6 lg:py-12'}
      `}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
