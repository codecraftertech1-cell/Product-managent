import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    setMounted(true);
    
    const htmlElement = document.documentElement;
    if (shouldBeDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 400);

    const newIsDark = !isDark;
    setIsDark(newIsDark);

    const htmlElement = document.documentElement;
    if (newIsDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0 hover:scale-110 duration-200 relative"
    >
      <div className={`transition-all duration-400 ${isRotating ? 'rotate-360 scale-100' : 'rotate-0 scale-100'}`}>
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400 animate-spin-slow" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </div>
    </Button>
  );
}