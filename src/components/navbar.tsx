import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Accueil', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Logs', path: '/logs' }
];

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center flex flex-col">
        <div className="text-xl font-bold">CARSPOT</div>
        
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className="hover:text-gray-300 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;