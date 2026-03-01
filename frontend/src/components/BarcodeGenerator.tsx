import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Minus, Download, Save, Scan, Trash2 } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types';

interface BarcodeGeneratorProps {
  products: Product[];
}

interface SelectedProduct extends Product {
  selectedQuantity: number;
  adjustedPrice: number;
}

export function BarcodeGenerator({ products }: BarcodeGeneratorProps) {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>(products);
  const [currentBarcode, setCurrentBarcode] = useState<string>('');
  const [currentProduct, setCurrentProduct] = useState<SelectedProduct | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    setAvailableProducts(products);
  }, [products]);

  const getProductId = (product: { _id?: string; id: number }) => product._id || String(product.id);

  const addProduct = (productId: string) => {
    const product = availableProducts.find(p => getProductId(p) === productId);
    if (product && selectedProducts.length < 1000) {
      const selectedProduct: SelectedProduct = {
        ...product,
        selectedQuantity: 1,
        adjustedPrice: product.price
      };
      setSelectedProducts(prev => [...prev, selectedProduct]);
      setAvailableProducts(prev => prev.filter(p => getProductId(p) !== productId));
    }
  };

  const createNewProduct = () => {
    if (selectedProducts.length >= 1000) return;

    const newProduct: SelectedProduct = {
      _id: nextId.toString(),
      id: nextId,
      name: `Product ${nextId}`,
      sku: `SKU${nextId}`,
      description: '',
      price: 0,
      quantity: 0,
      category: 'Other',
      selectedQuantity: 1,
      adjustedPrice: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSelectedProducts(prev => [...prev, newProduct]);
    setNextId(prev => prev + 1);
  };

  const removeProduct = (productId: string) => {
    const product = selectedProducts.find(p => getProductId(p) === productId);
    if (product) {
      setSelectedProducts(prev => prev.filter(p => getProductId(p) !== productId));
      setAvailableProducts(prev => [...prev, product]);
    }
  };

  const updateProduct = (productId: string, updates: Partial<SelectedProduct>) => {
    setSelectedProducts(prev => prev.map(p =>
      getProductId(p) === productId ? { ...p, ...updates } : p
    ));
  };

  const generateBarcode = async (product: SelectedProduct) => {
    setIsGenerating(true);
    setCurrentProduct(product);
    try {
      const barcodeData = JSON.stringify({
        id: product._id,
        name: product.name,
        price: product.adjustedPrice,
        quantity: product.selectedQuantity
      });
      const qrCodeUrl = await QRCode.toDataURL(barcodeData, { width: 200, margin: 2 });
      setCurrentBarcode(qrCodeUrl);
    } catch (error) {
      console.error('Error generating barcode:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const adjustPrice = (productId: string, delta: number) => {
    const product = selectedProducts.find(p => getProductId(p) === productId);
    if (product) {
      const newPrice = Math.max(0, product.adjustedPrice + delta);
      updateProduct(productId, { adjustedPrice: newPrice });
    }
  };

  const adjustQuantity = (productId: string, delta: number) => {
    const product = selectedProducts.find(p => getProductId(p) === productId);
    if (product) {
      const newQuantity = Math.max(1, product.selectedQuantity + delta);
      updateProduct(productId, { selectedQuantity: newQuantity });
    }
  };

  const saveAllChanges = async () => {
    try {
      for (const product of selectedProducts) {
        const prodId = getProductId(product);
        await productAPI.update(prodId, {
          price: product.adjustedPrice,
          quantity: product.quantity + product.selectedQuantity // Add to existing quantity
        });
      }
      alert('All products updated successfully!');
    } catch (error) {
      console.error('Error saving products:', error);
      alert('Error saving products');
    }
  };

  const downloadBarcode = () => {
    if (!currentBarcode) return;

    const link = document.createElement('a');
    link.href = currentBarcode;
    link.download = `barcode-${currentProduct?.name || 'product'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scanBarcode = () => {
    // Simulate scanning - in real app, would use camera/barcode scanner
    setScannerOpen(true);
    // For demo, we'll show a mock scanned product
    setTimeout(() => {
      if (selectedProducts.length > 0) {
        setScannedProduct(selectedProducts[0]);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 ">
      <Card>
        <CardHeader>
          <CardTitle>Barcode Generator & Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Add Products (Max 1000)</label>
            <div className="flex gap-2">
              <Select onValueChange={addProduct}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select existing products" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.slice(0, 100).map(product => (
                    <SelectItem key={getProductId(product)} value={getProductId(product)}>
                      {product.name} - ${product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={createNewProduct} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Button>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProducts.map(product => (
                    <TableRow key={getProductId(product)}>
                      <TableCell>
                        <Input
                          value={product.name}
                          onChange={(e) => updateProduct(getProductId(product), { name: e.target.value })}
                          className="min-w-32 text-black bg-white"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={getProductId(product)}
                          onChange={(e) => updateProduct(getProductId(product), { _id: e.target.value })}
                          className="font-mono text-xs min-w-24 text-black bg-white"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustQuantity(getProductId(product), -1)}
                            disabled={product.selectedQuantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={product.selectedQuantity}
                            onChange={(e) => updateProduct(getProductId(product), { selectedQuantity: parseInt(e.target.value) || 1 })}
                            className="w-16 text-center text-black bg-white"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustQuantity(getProductId(product), 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustPrice(getProductId(product), -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={product.adjustedPrice}
                            onChange={(e) => updateProduct(getProductId(product), { adjustedPrice: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-center text-black bg-white"
                            min="0"
                            step="0.01"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustPrice(getProductId(product), 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateBarcode(product)}
                          >
                            Generate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProduct(getProductId(product))}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex gap-2">
                <Button onClick={saveAllChanges} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
                <Button variant="outline" onClick={scanBarcode}>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Barcode
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentBarcode && currentProduct && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="flex flex-col items-center gap-2">
              <img src={currentBarcode} alt="QR Code" className="w-48 h-48" />
              <div className="text-center">
                <div className="font-semibold">{currentProduct.name}</div>
                <div className="text-sm text-muted-foreground">ID: {currentProduct._id ? currentProduct._id.slice(-8) : String(currentProduct.id).slice(-8)}</div>
                <div className="text-sm text-muted-foreground">Price: ${currentProduct.adjustedPrice}</div>
                <div className="text-sm text-muted-foreground">Quantity: {currentProduct.selectedQuantity}</div>
              </div>
            </div>
            <Button variant="outline" onClick={downloadBarcode}>
              <Download className="w-4 h-4 mr-2" />
              Download Barcode
            </Button>
            {isGenerating && (
              <div className="text-sm text-muted-foreground">Generating barcode...</div>
            )}
          </CardContent>
        </Card>
      )}

      {scannerOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Barcode Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            {scannedProduct ? (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">{scannedProduct.name}</div>
                <div className="text-sm text-muted-foreground">Product ID: {scannedProduct._id}</div>
                <div className="text-sm text-muted-foreground">Price: ${scannedProduct.price}</div>
                <Button onClick={() => { setScannerOpen(false); setScannedProduct(null); }}>
                  Close Scanner
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-muted-foreground mb-4">Scanning...</div>
                <div className="w-32 h-32 bg-muted rounded mx-auto flex items-center justify-center">
                  <Scan className="w-8 h-8" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}