import { productsData as initialProducts } from '../data/products';

const STORAGE_KEY = 'pharmavet_custom_products';

export const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProducts;
    const customProducts = JSON.parse(raw);
    if (!Array.isArray(customProducts)) return initialProducts;
    
    const map = new Map();
    initialProducts.forEach(item => map.set(String(item.id), item));
    customProducts.forEach(item => map.set(String(item.id), item));
    
    return Array.from(map.values());
  } catch (e) {
    console.error("Error reading products from localStorage:", e);
    return initialProducts;
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('pharmavet_products_updated'));
  } catch (e) {
    console.error("Error saving products to localStorage:", e);
  }
};

export const addOrUpdateProduct = (productData) => {
  const current = getStoredProducts();
  let updated;
  
  if (productData.id) {
    updated = current.map(item => String(item.id) === String(productData.id) ? { ...item, ...productData } : item);
  } else {
    const newId = Date.now();
    const slug = productData.slug || (productData.name?.GE || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9ge-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `product-${newId}`;
    
    const newProduct = {
      ...productData,
      id: newId,
      slug
    };
    updated = [newProduct, ...current];
  }
  
  saveProducts(updated);
  return updated;
};

export const deleteProduct = (productId) => {
  const current = getStoredProducts();
  const updated = current.filter(item => String(item.id) !== String(productId));
  saveProducts(updated);
  return updated;
};
