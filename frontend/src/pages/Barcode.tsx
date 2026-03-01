import { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pin, Download, Plus, Trash2, Edit, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EAN13BarcodeGenerator, { generateEAN13 } from '@/components/EAN13BarcodeGenerator';

interface BarcodeItem {
  id: number;
  value: string;
  productName: string;
}

export default function Barcode() {
  const [productName, setProductName] = useState<string>('');
  const [barcodeValue, setBarcodeValue] = useState<string>('');
  const [generatedBarcodes, setGeneratedBarcodes] = useState<BarcodeItem[]>([]);
  const [barcodeCount, setBarcodeCount] = useState(1);
  
  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editBarcodeValue, setEditBarcodeValue] = useState('');

  // Calculate check digit for EAN-13
  const calculateCheckDigit = (barcode: string): number => {
    const digits = barcode.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  };

  // Validate EAN-13 barcode
  const isValidEAN13 = (value: string): boolean => {
    const clean = value.replace(/\D/g, '');
    if (clean.length !== 13) return false;
    
    // Verify check digit
    const digits = clean.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    const calculatedCheck = (10 - (sum % 10)) % 10;
    return calculatedCheck === digits[12];
  };

  const generateBarcode = () => {
    if (barcodeValue.trim() === '') return;
    
    // Generate full EAN-13 with check digit if not complete
    let eanValue = generateEAN13(barcodeValue);
    
    // Ensure it's exactly 13 digits
    if (eanValue.length !== 13) {
      alert('Please enter a valid 12 or 13 digit number for EAN-13 barcode');
      return;
    }
    
    const newItem: BarcodeItem = {
      id: Date.now(),
      value: eanValue,
      productName: productName.trim() || 'Unnamed Product'
    };
    
    setGeneratedBarcodes(prev => [...prev, newItem]);
    setProductName('');
    setBarcodeValue('');
  };

  const addMultipleBarcodes = () => {
    if (barcodeValue.trim() === '') return;
    
    // Generate full EAN-13 with check digit if not complete
    let eanValue = generateEAN13(barcodeValue);
    
    // Ensure it's exactly 13 digits
    if (eanValue.length !== 13) {
      alert('Please enter a valid 12 or 13 digit number for EAN-13 barcode');
      return;
    }
    
    const newItems: BarcodeItem[] = [];
    const name = productName.trim() || 'Unnamed Product';
    
    for (let i = 0; i < barcodeCount; i++) {
      newItems.push({
        id: Date.now() + i,
        value: eanValue,
        productName: name
      });
    }
    
    setGeneratedBarcodes(prev => [...prev, ...newItems]);
    setProductName('');
    setBarcodeValue('');
  };

  const removeBarcode = (id: number) => {
    setGeneratedBarcodes(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setGeneratedBarcodes([]);
  };

  // Start editing
  const startEdit = (item: BarcodeItem) => {
    setEditingId(item.id);
    setEditProductName(item.productName);
    setEditBarcodeValue(item.value);
  };

  // Save editing
  const saveEdit = () => {
    if (editingId !== null && editBarcodeValue.trim() !== '') {
      // Generate full EAN-13 with check digit
      let eanValue = generateEAN13(editBarcodeValue);
      
      if (eanValue.length !== 13) {
        alert('Please enter a valid 12 or 13 digit number for EAN-13 barcode');
        return;
      }
      
      setGeneratedBarcodes(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, productName: editProductName.trim() || 'Unnamed Product', value: eanValue }
          : item
      ));
      setEditingId(null);
      setEditProductName('');
      setEditBarcodeValue('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditProductName('');
    setEditBarcodeValue('');
  };

  // Download barcode using JsBarcode for EAN-13
  const downloadBarcode = (item: BarcodeItem) => {
    const value = item.value;
    const format = 'EAN13';
    
    // Create SVG using JsBarcode
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, value, {
      format: format,
      width: 2,
      height: 80,
      displayValue: true,
      fontSize: 16,
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000'
    });
    
    // Convert SVG to canvas then download
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `barcode-${value}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadAll = () => {
    generatedBarcodes.forEach((item, index) => {
      setTimeout(() => {
        downloadBarcode(item);
      }, index * 300);
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="p-2 sm:p-4 lg:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EAN-13 Barcode Generator</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Generate EAN-13 barcodes with custom name and ID number</p>
          </div>

          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
            <span className="text-[150px] sm:text-[200px] lg:text-[300px] font-bold text-foreground whitespace-nowrap">Al-Riwaj</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Input Section */}
            <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 lg:pb-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 gap-2">
                <CardTitle className="text-base sm:text-lg lg:text-lg font-bold">Create New Barcode</CardTitle>
                <Pin className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
              </CardHeader>
              <CardContent className="pt-3 sm:pt-4 lg:pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Product Name</label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Pepsi, Coca Cola, etc."
                      className="text-lg text-black bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Barcode Number (EAN-13)</label>
                    <Input
                      value={barcodeValue}
                      onChange={(e) => setBarcodeValue(e.target.value)}
                      placeholder="e.g., 8901234567890 (12 or 13 digits)"
                      className="text-lg font-mono text-black bg-white"
                      maxLength={13}
                      onKeyDown={(e) => e.key === 'Enter' && generateBarcode()}
                    />
                    <p className="text-xs text-muted-foreground">Enter 12 or 13 digits (check digit will be auto-calculated)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Number of Barcodes</label>
                    <Input
                      type="number"
                      value={barcodeCount}
                      onChange={(e) => setBarcodeCount(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={100}
                      className="w-full md:w-32 text-black bg-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={addMultipleBarcodes} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate {barcodeCount > 1 ? `${barcodeCount} Barcodes` : 'Barcode'}
                    </Button>
                    <Button onClick={generateBarcode} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Single
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Barcodes List Table */}
            <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 lg:pb-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg lg:text-lg font-bold">Barcodes List</CardTitle>
                  <span className="text-sm text-muted-foreground">({generatedBarcodes.length})</span>
                </div>
                <div className="flex gap-2">
                  {generatedBarcodes.length > 0 && (
                    <>
                      <Button onClick={downloadAll} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                      <Button onClick={clearAll} variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-3 sm:pt-4 lg:pt-6">
                {generatedBarcodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <p>No barcodes generated yet. Enter product name and barcode number above to create one.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">#</TableHead>
                          <TableHead className="text-center">Product Name</TableHead>
                          <TableHead className="text-center">Barcode ID</TableHead>
                          <TableHead className="text-center">Barcode Preview</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedBarcodes.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                            <TableCell className="text-center">
                              {editingId === item.id ? (
                                <Input
                                  value={editProductName}
                                  onChange={(e) => setEditProductName(e.target.value)}
                                  className="text-black bg-white text-center"
                                  placeholder="Product Name"
                                />
                              ) : (
                                item.productName
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {editingId === item.id ? (
                                <Input
                                  value={editBarcodeValue}
                                  onChange={(e) => setEditBarcodeValue(e.target.value)}
                                  className="text-black bg-white text-center font-mono"
                                  placeholder="Barcode ID"
                                />
                              ) : (
                                <span className="font-mono">{item.value}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {editingId === item.id ? (
                                <span className="text-xs text-muted-foreground">Editing...</span>
                              ) : (
                                <div className="flex justify-center items-center min-h-[80px]">
                                  <EAN13BarcodeGenerator 
                                    value={item.value} 
                                    width={1.5} 
                                    height={50} 
                                    fontSize={12}
                                    displayValue={true}
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                {editingId === item.id ? (
                                  <>
                                    <Button variant="outline" size="sm" onClick={saveEdit}>
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => downloadBarcode(item)}>
                                      <Download className="w-3 h-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => removeBarcode(item.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
