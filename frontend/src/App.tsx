import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { QRCodePage } from './pages/QRCode';
import Barcode from './pages/Barcode';
import { AddProduct } from './pages/AddProduct';
import { EditProduct } from './pages/EditProduct';
import Login from './pages/login';
import { Sales } from './pages/Sales';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
  }, []);

  // Show login page for root path
  if (location.pathname === '/' || location.pathname === '/login') {
    return <Login />;
  }

  // Show full layout with sidebar, header, navbar for dashboard and all app pages
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-background transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:inset-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Navbar />

        <div className="animate-fade-in">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/qrcode" element={<QRCodePage />} />
            <Route path="/barcode" element={<Barcode />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
