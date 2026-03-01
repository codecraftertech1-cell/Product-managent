import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

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

interface EAN13BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
}

export default function EAN13Barcode({
  value,
  width = 2,
  height = 80,
  displayValue = true,
  fontSize = 16,
  margin = 10
}: EAN13BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clean value - keep only digits
    let cleanValue = value.replace(/\D/g, '');
    
    // Pad with zeros if needed for testing
    if (cleanValue.length < 8) {
      cleanValue = cleanValue.padStart(8, '0');
    }
    
    // If 12 digits, add check digit
    if (cleanValue.length === 12) {
      const checkDigit = calculateCheckDigit(cleanValue);
      cleanValue = cleanValue + checkDigit;
    }
    
    // Take first 13 digits
    cleanValue = cleanValue.substring(0, 13);

    try {
      JsBarcode(svgRef.current, cleanValue, {
        format: 'EAN13',
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: fontSize,
        margin: margin,
        background: '#ffffff',
        lineColor: '#000000',
        textMargin: 5,
        font: 'monospace'
      });
    } catch (error) {
      console.error('EAN-13 Error:', error);
    }
  }, [value, width, height, displayValue, fontSize, margin]);

  return (
    <svg ref={svgRef}></svg>
  );
}

// Format barcode for display
export function formatEAN13Display(barcode: string): string {
  const clean = barcode.replace(/\D/g, '').substring(0, 13);
  if (clean.length < 13) return barcode;
  return `${clean[0]}  ${clean.substring(1, 7)}  ${clean.substring(7, 13)}`;
}

// Generate full EAN-13 with check digit
export function generateEAN13(input: string): string {
  const clean = input.replace(/\D/g, '').substring(0, 12);
  if (clean.length === 12) {
    const checkDigit = calculateCheckDigit(clean);
    return clean + checkDigit;
  }
  return clean.substring(0, 13);
}
