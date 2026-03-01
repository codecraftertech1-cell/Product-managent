import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddProductForm } from '../components/AddProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types';

export function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id);
      const response = await productAPI.getById(id!);
      console.log('Product response:', response.data);
      setProduct(response.data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      console.error('Error response:', error?.response?.data);
      alert('Error loading product: ' + (error?.message || 'Unknown error'));
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    console.log('=== handleUpdateProduct called ===');
    console.log('Product ID:', id);
    if (!id) {
      alert('Product ID not found');
      return;
    }
    try {
      console.log('Calling update API with ID:', id);
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      const response = await productAPI.update(id, formData);
      console.log('Update response:', response.data);
      alert('Product updated successfully!');
      navigate('/products', { state: { refresh: Date.now() } });
    } catch (error: any) {
      console.error('=== Error updating product ===');
      console.error('Error:', error);
      console.error('Error response:', error?.response?.data);
      const errorData = error?.response?.data;
      let errorMessage = 'Unknown error';
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      }
      alert('Error updating product: ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Product not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="p-2 sm:p-4 lg:p-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
            <Button variant="ghost" onClick={() => navigate('/products')} className="hover:bg-primary/10 hover:text-primary transition-all text-xs sm:text-sm">
              <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              Back to Products
            </Button>
          </div>

          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
            <span className="text-[150px] sm:text-[200px] lg:text-[300px] font-bold text-foreground whitespace-nowrap">Al-Riwaj</span>
          </div>

          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/30 transition-all">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Edit Product</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Update product information</p>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <AddProductForm
                onSubmit={handleUpdateProduct}
                initialData={product}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
