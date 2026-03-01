import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import type { Product } from '../types';

interface AddProductFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Product;
}

export function AddProductForm({ onSubmit, initialData }: AddProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    category: initialData?.category || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom category state
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== AddProductForm handleSubmit called ===');
    console.log('initialData:', initialData);
    console.log('formData:', formData);
    console.log('imageFile:', imageFile);

    // Create FormData for file upload
    const formDataToSend = new FormData();

    // Always append ID if we're editing
    if (initialData?.id) {
      console.log('Appending id:', initialData.id);
      formDataToSend.append('id', initialData.id.toString());
    }
    if (initialData?._id) {
      console.log('Appending _id:', initialData._id);
      formDataToSend.append('_id', initialData._id);
    }

    // Append all fields - Laravel's 'sometimes' validation will handle partial updates
    // This ensures at least some data is sent
    if (formData.name !== undefined && formData.name !== null) {
      console.log('Appending name:', formData.name);
      formDataToSend.append('name', formData.name || '');
    }
    if (formData.description !== undefined) {
      formDataToSend.append('description', formData.description || '');
    }
    if (formData.price !== undefined && formData.price !== null) {
      console.log('Appending price:', formData.price);
      formDataToSend.append('price', formData.price.toString());
    }
    if (formData.quantity !== undefined && formData.quantity !== null) {
      console.log('Appending quantity:', formData.quantity);
      formDataToSend.append('quantity', formData.quantity.toString());
    }
    if (formData.category !== undefined && formData.category !== null) {
      console.log('Appending category:', formData.category);
      formDataToSend.append('category', formData.category);
    }

    // Always append image if a new one is selected
    if (imageFile) {
      console.log('Appending image:', imageFile.name);
      formDataToSend.append('image', imageFile);
    }

    console.log('Calling onSubmit with FormData');
    onSubmit(formDataToSend);

    // Only reset if not editing
    if (!initialData) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        category: '',
      });
      setCategories([]);
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const trimmedCategory = newCategory.trim();
      if (!categories.includes(trimmedCategory)) {
        setCategories([...categories, trimmedCategory]);
      }
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    if (formData.category === categoryToDelete) {
      setFormData({ ...formData, category: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Product Name</label>
        <Input
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => {
            console.log('Name changed:', e.target.value);
            setFormData({ ...formData, name: e.target.value });
          }}
          className="bg-white dark:bg-gray-800 border-border/50 focus:border-primary focus:bg-background transition-all text-xs sm:text-sm py-2 sm:py-3 text-black dark:text-white"
          required
        />
      </div>

      <div>
        <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Product Description</label>
        <Textarea
          placeholder="Enter product description"
          value={formData.description || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            console.log('Description changed:', e.target.value);
            setFormData({ ...formData, description: e.target.value });
          }}
          className="bg-white dark:bg-gray-800 border-border/50 focus:border-primary focus:bg-background transition-all text-xs sm:text-sm text-black dark:text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Price</label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => {
              console.log('Price changed:', e.target.value);
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
            }}
            className="bg-white dark:bg-gray-800 border-border/50 focus:border-primary focus:bg-background transition-all text-xs sm:text-sm py-2 sm:py-3 text-black dark:text-white"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Quantity</label>
          <Input
            type="number"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) => {
              console.log('Quantity changed:', e.target.value);
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
            }}
            className="bg-white dark:bg-gray-800 border-border/50 focus:border-primary focus:bg-background transition-all text-xs sm:text-sm py-2 sm:py-3 text-black dark:text-white"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Category</label>
        
        {/* Category list with delete buttons */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm border cursor-pointer transition-all ${
                  formData.category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-primary/10 text-foreground border-primary/30 hover:border-primary'
                }`}
                onClick={() => setFormData({ ...formData, category: cat })}
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat);
                  }}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add category button or input */}
        {!showCategoryInput ? (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 text-xs sm:text-sm py-2"
            onClick={() => setShowCategoryInput(true)}
          >
            + Add your category
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className="bg-white dark:bg-gray-800 border-border/50 focus:border-primary focus:bg-background transition-all text-xs sm:text-sm py-2 sm:py-3 text-black dark:text-white"
              autoFocus
            />
            <Button
              type="button"
              onClick={handleAddCategory}
              className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm py-2 px-4"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCategoryInput(false);
                setNewCategory('');
              }}
              className="text-xs sm:text-sm py-2 px-3"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">Product Image</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        {!imagePreview ? (
          <div
            className="border-2 border-dashed border-primary/30 rounded-lg p-4 sm:p-6 flex items-center justify-center bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Click to upload image</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full h-24 sm:h-32 object-cover rounded-lg border border-primary/30 shadow-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 shadow-lg text-xs"
              onClick={removeImage}
            >
              <X className="w-3 sm:w-4 h-3 sm:h-4" />
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg text-xs sm:text-sm py-2 sm:py-3">
        Save Product
      </Button>
    </form>
  );
}