import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Package, QrCode, LogOut, ScanBarcode, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authAPI } from '@/services/api';
import { FaSackDollar } from 'react-icons/fa6';

interface NavItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: ShoppingBag, label: 'Products', path: '/products' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: QrCode, label: 'QR Code', path: '/qrcode' },
  { icon: ScanBarcode, label: 'Barcode', path: '/barcode' },
  { icon: FaSackDollar, label: 'Sales', path: '/sales' }
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
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
    <div className="w-20 lg:w-24 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border flex flex-col items-center py-4 lg:py-8 gap-4 lg:gap-8 backdrop-blur-sm shadow-lg h-screen animate-slide-in-left">
      <style>{`
        .rotate-alriwaj {
          animation: rotateText 3s ease-in-out infinite;
        }
        @keyframes rotateText {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
      <div className="relative group">
        <div 
          className="flex items-center justify-center w-16 h-10 lg:w-20 lg:h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg text-primary-foreground font-bold text-xs lg:text-sm shadow-lg cursor-pointer"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          <span style={{ color: '#00FFFF', textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }} className="font-bold">Al-Riwaj</span>
        </div>
        <div className="absolute inset-0 rounded-lg -z-10 blur-xl bg-gradient-to-r from-purple-600/30 via-purple-500/30 to-purple-400/30" style={{ animation: 'pulse 2s ease-in-out infinite' }}></div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg animate-pulse-scale bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-lg"></div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 lg:gap-3">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'p-2 md:p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-110 relative',
                isActive
                  ? 'bg-gradient-to-br from-primary to-secondary text-sidebar-primary-foreground shadow-lg scale-105'
                  : 'text-sidebar-foreground/60 hover:text-primary hover:bg-sidebar-accent/60 hover:shadow-md'
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
              title={item.label}
            >
              {/* Purple glow effect on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 blur-md"></div>
              </div>
              <Icon className="w-4 md:w-5 h-4 md:h-5 transition-transform duration-300 group-hover:rotate-180 relative z-10" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
