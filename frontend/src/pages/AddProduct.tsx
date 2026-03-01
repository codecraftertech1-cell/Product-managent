import { useNavigate } from 'react-router-dom';
import { AddProductForm } from '../components/AddProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { productAPI } from '../services/api';

export function AddProduct() {
  const navigate = useNavigate();

  const handleAddProduct = async (formData: FormData) => {
    try {
      console.log('Adding product with data:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      const response = await productAPI.create(formData);
      console.log('Product added successfully:', response.data);
      alert('Product added successfully!');
      navigate('/products', { state: { refresh: Date.now() } });
    } catch (error: any) {
      console.error('Error adding product:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      const errorData = error?.response?.data;
      let errorMessage = 'Unknown error';
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.exception) {
          errorMessage = errorData.exception;
        } else {
          // Format validation errors
          errorMessage = JSON.stringify(errorData);
        }
      }
      alert('Error adding product: ' + errorMessage);
    }
  };

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
              <CardTitle className="text-xl sm:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Add New Product</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Fill in the details to add a new product to your inventory</p>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <AddProductForm onSubmit={handleAddProduct} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
