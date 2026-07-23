import { blogArticles as initialArticles } from '../data/blogData';

const STORAGE_KEY = 'pharmavet_custom_blogs';

export const getStoredArticles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialArticles;
    const customArticles = JSON.parse(raw);
    if (!Array.isArray(customArticles)) return initialArticles;
    
    // Merge initialArticles and customArticles (customArticles take precedence by id)
    const map = new Map();
    initialArticles.forEach(item => map.set(item.id, item));
    customArticles.forEach(item => map.set(item.id, item));
    
    return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error("Error reading blogs from localStorage:", e);
    return initialArticles;
  }
};

export const saveArticles = (articles) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new Event('pharmavet_blogs_updated'));
  } catch (e) {
    console.error("Error saving blogs to localStorage:", e);
  }
};

export const addOrUpdateArticle = (articleData) => {
  const current = getStoredArticles();
  let updated;
  
  if (articleData.id) {
    updated = current.map(item => item.id === articleData.id ? { ...item, ...articleData } : item);
  } else {
    const newId = Date.now();
    const slug = articleData.slug || articleData.title.GE.toLowerCase()
      .replace(/[^a-z0-9ge-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `blog-${newId}`;
    
    const newArticle = {
      ...articleData,
      id: newId,
      slug,
      date: articleData.date || new Date().toISOString().split('T')[0]
    };
    updated = [newArticle, ...current];
  }
  
  saveArticles(updated);
  return updated;
};

export const deleteArticle = (articleId) => {
  const current = getStoredArticles();
  const updated = current.filter(item => item.id !== articleId);
  saveArticles(updated);
  return updated;
};
