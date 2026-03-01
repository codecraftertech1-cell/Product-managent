import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { authAPI } from '@/services/api';
import { LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Products', path: '/products' },
  { name: 'Add Product', path: '/add-product' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Barcode', path: '/barcode' },
  { name: 'QR Code', path: '/qrcode' },
  { name: 'Sales', path: '/sales' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-card via-card to-card/90 border-b border-border/50 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 shadow-md backdrop-blur-sm overflow-x-auto">
      <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 min-w-min">
        {/* Navigation Links */}
        <div className="flex gap-1 sm:gap-1.5 lg:gap-2 flex-wrap justify-end items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap',
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              )}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap text-red-500 hover:text-white hover:bg-red-500 flex items-center gap-1"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
