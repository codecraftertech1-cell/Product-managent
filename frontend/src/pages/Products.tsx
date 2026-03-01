import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductTable } from '../components/ProductTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types';

export function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, [location.state]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else if (searchQuery === '') {
        fetchData();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setIsSearching(false);
      const productsRes = await productAPI.getAll();
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const productsRes = await productAPI.search(query);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchData();
  };

  const handleEditProduct = (product: Product) => {
    const productId = product._id || String(product.id);
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 h-full">
          <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-6">
            <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 lg:pb-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-t-lg gap-2 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {/* Search Bar */}
                  <div className="relative flex items-center w-full sm:w-64 lg:w-80 order-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                    <input
                      type="text"
                      placeholder="Search by your product name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm text-black bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-foreground"
                      >
                        <X className="w-4 h-4 text-black" />
                      </button>
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent order-2">All Products</CardTitle>
                </div>
                <Button onClick={() => navigate('/add-product')} className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark shadow-lg text-xs sm:text-sm">
                  <Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent className="pt-3 sm:pt-4 lg:pt-6">
                {/* Background watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                  <span className="text-[150px] sm:text-[200px] lg:text-[300px] font-bold text-foreground whitespace-nowrap">Al-Riwaj</span>
                </div>
                <ProductTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}