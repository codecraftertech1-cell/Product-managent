import { Bell, Menu, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-12 sm:h-14 lg:h-16 border-b border-border bg-gradient-to-r from-card via-card to-card/80 px-3 sm:px-4 lg:px-6 flex items-center justify-between backdrop-blur-sm bg-opacity-95 shadow-lg gap-2 animate-slide-in-down">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0 lg:hidden hover:scale-110 duration-200">
          <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
        </Button>
        <h1 className="text-xs sm:text-sm lg:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent truncate animate-gradient-flow">Product Mgmt</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden sm:flex items-center gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all"
          onClick={() => window.open('https://al-riwaj.vercel.app', '_blank')}
        >
          <ExternalLink className="w-3 h-3" />
          <span style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }} className="font-bold text-xs">Al-Riwaj Web</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0 hover:scale-110 hover:animate-bounce-slow duration-200">
          <Bell className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5" />
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
}
