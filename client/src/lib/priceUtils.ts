// Price utility functions based on Gemini AI recommendations
// Handles inconsistent data formats (cents vs dollars) in the database

export function detectUnit(price: number): 'cents' | 'dollars' {
  // Heuristic: Prices above 1000 are likely in cents
  // This threshold can be adjusted based on your typical price ranges
  const centsThreshold = 1000;
  
  if (price >= centsThreshold) {
    return 'cents';
  } else {
    return 'dollars';
  }
}

export function convertToCents(price: number, unit?: 'cents' | 'dollars'): number {
  // If unit is not provided, detect it automatically
  const detectedUnit = unit || detectUnit(price);
  
  if (detectedUnit === 'dollars') {
    return Math.round(price * 100); // Convert dollars to cents
  } else {
    return price; // Already in cents
  }
}

export function convertToDollars(price: number, unit?: 'cents' | 'dollars'): number {
  // If unit is not provided, detect it automatically
  const detectedUnit = unit || detectUnit(price);
  
  if (detectedUnit === 'cents') {
    return price / 100; // Convert cents to dollars
  } else {
    return price; // Already in dollars
  }
}

export function formatPrice(price: number | string, unit?: 'cents' | 'dollars'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return '$0.00';
  const dollars = convertToDollars(numericPrice, unit);
  return `$${dollars.toFixed(2)}`;
}

export function formatAsDollars(price: number | string, unit?: 'cents' | 'dollars'): string {
  return formatPrice(price, unit);
}

export function normalizeToCents(price: number): number {
  // Ensure all prices are stored as cents in the database
  const unit = detectUnit(price);
  return convertToCents(price, unit);
}

export function normalizeForDisplay(price: number): number {
  // Ensure all prices are displayed as dollars in the UI
  const unit = detectUnit(price);
  return convertToDollars(price, unit);
}

// For form handling - converts database value to form-friendly dollar value
export function prepareForForm(price: number): string {
  const dollars = normalizeForDisplay(price);
  return dollars.toString();
}

// For database submission - converts form dollar value to cents
export function prepareForDatabase(dollarValue: string | number): number {
  const dollars = typeof dollarValue === 'string' ? parseFloat(dollarValue) : dollarValue;
  return Math.round(dollars * 100); // Always store as cents
}