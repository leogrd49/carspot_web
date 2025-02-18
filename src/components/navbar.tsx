import { useState, useEffect } from 'react';
import Logo from '../assets/LOGO_TRANSPERENT_.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'écran est de taille mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px est généralement la taille "md" dans Tailwind
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const navItems = [
    { label: 'Accueil', path: '/', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )},
    { label: 'Dashboard', path: '/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    )},
    { label: 'Analytics', path: '/analytics', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    )},
    { label: 'Tables', path: '/tables', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    )}
  ];

  if (isMobile) {
    return (
      <nav className="bg-[#262525] text-white fixed top-0 left-0 right-0 z-[10] shadow-md">
        <div className="flex items-center justify-between p-2">
          <img src={Logo} alt="Logo Carspot" className="h-10 w-auto" />
          <button
            className="text-white p-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        {isExpanded && (
          <ul className="flex flex-col w-full">
            {navItems.map((item) => (
              <li key={item.path} className="w-full">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-3 transition-colors ${
                      isActive ? 'text-[#FFC710] bg-[#1e1e1e]' : 'hover:text-[#FFC710] hover:bg-[#1e1e1e]'
                    }`
                  }
                  onClick={() => setIsExpanded(false)}
                >
                  <div className="min-w-6">{item.icon}</div>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    );
  }

  return (
    <nav
      className={`bg-[#262525] text-white p-4 ${isExpanded ? 'w-52' : 'w-16 sm:w-24'} transition-all duration-300 fixed h-screen z-[10]`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-center h-full">
        <img src={Logo} alt="Logo Carspot" className={`transition-all duration-300 ${isExpanded ? 'w-20' : 'w-10 sm:w-16'}`} />
        <ul className="flex flex-col justify-around h-full w-full mt-6">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-2 ${isExpanded ? 'pl-5' : 'justify-center'} relative transition-colors group ${
                    isActive ? 'text-[#FFC710]' : 'hover:text-[#FFC710]'
                  }`
                }
              >
                <div className="min-w-6">{item.icon}</div>
                <span className={`
                  transition-all duration-300 whitespace-nowrap
                  ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 absolute left-full ml-2 invisible group-hover:visible group-hover:bg-[#262525] group-hover:px-2 group-hover:py-1 group-hover:rounded group-hover:opacity-100'}
                `}>
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
