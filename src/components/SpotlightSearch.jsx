import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredProducts } from '../utils/productStore';
import { getStoredArticles } from '../utils/blogStore';

const SpotlightSearch = ({ isOpen, onClose, lang = 'GE' }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); 
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Products
  const allProducts = getStoredProducts();
  const allArticles = getStoredArticles();

  // Search Products
  const filteredProducts = cleanQuery
    ? allProducts.filter((p) => {
        const nameMatch = p.name?.[lang]?.toLowerCase().includes(cleanQuery) || p.name?.GE?.toLowerCase().includes(cleanQuery);
        const manufacturerMatch = p.manufacturer?.toLowerCase().includes(cleanQuery);
        const purposeMatch = p.purpose?.[lang]?.toLowerCase().includes(cleanQuery);
        return nameMatch || manufacturerMatch || purposeMatch;
      }).slice(0, 5)
    : [];

  // Search Blog Articles
  const filteredArticles = cleanQuery
    ? allArticles.filter((a) => {
        const titleMatch = a.title?.[lang]?.toLowerCase().includes(cleanQuery) || a.title?.GE?.toLowerCase().includes(cleanQuery);
        const excerptMatch = a.excerpt?.[lang]?.toLowerCase().includes(cleanQuery);
        return titleMatch || excerptMatch;
      }).slice(0, 4)
    : [];

  const handleSelectProduct = (product) => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  const handleSelectArticle = (article) => {
    onClose();
    navigate(`/blog/${article.slug}`);
  };

  const hasResults = filteredProducts.length > 0 || filteredArticles.length > 0;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-28 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2rem] max-w-2xl w-full border-2 border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'GE' 
                ? 'ძებნა პროდუქტებში, ბლოგის სტატიებსა და მწარმოებლებში...' 
                : lang === 'EN' 
                ? 'Search products, blog articles, and manufacturers...' 
                : 'Поиск по товарам, блогу и производителям...'
            }
            className="w-full bg-transparent font-bold text-slate-900 text-sm md:text-base focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/60 rounded-lg hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-6">
          
          {!cleanQuery && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-black uppercase tracking-widest">
                {lang === 'GE' ? 'ჩაწერეთ საძიებო სიტყვა (მაგ. მასტიტი, ენროფლოქსაცინი, ბლოგი)' : 'Type to search...'}
              </p>
            </div>
          )}

          {cleanQuery && !hasResults && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-black text-slate-700 uppercase">
                {lang === 'GE' ? 'შედეგი ვერ მოიძებნა' : 'No results found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                "{query}"
              </p>
            </div>
          )}

          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-teal-600">
                <Package className="w-3.5 h-3.5" />
                {lang === 'GE' ? 'პროდუქცია' : 'Products'} ({filteredProducts.length})
              </div>
              <div className="space-y-1">
                {filteredProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-teal-50/60 transition-colors cursor-pointer group border border-transparent hover:border-teal-100"
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.name[lang]} 
                      className="w-12 h-12 object-contain rounded-xl p-1 bg-white border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest block">{prod.manufacturer}</span>
                      <h4 className="text-xs font-black text-slate-900 truncate uppercase group-hover:text-teal-700">
                        {prod.name[lang]}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate font-bold">{prod.purpose?.[lang]}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-teal-600 block">{prod.price.toFixed(1)} ₾</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Results */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-teal-600">
                <BookOpen className="w-3.5 h-3.5" />
                {lang === 'GE' ? 'ბლოგის სტატიები' : 'Blog Articles'} ({filteredArticles.length})
              </div>
              <div className="space-y-1">
                {filteredArticles.map((art) => (
                  <div 
                    key={art.id}
                    onClick={() => handleSelectArticle(art)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-teal-50/60 transition-colors cursor-pointer group border border-transparent hover:border-teal-100"
                  >
                    <img 
                      src={art.image} 
                      alt={art.title[lang]} 
                      className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{art.date}</span>
                      <h4 className="text-xs font-black text-slate-900 truncate uppercase group-hover:text-teal-700">
                        {art.title[lang]}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate font-bold">{art.excerpt[lang]}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 px-6 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center">
          <span>PharmaVet Quick Search</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
};

export default SpotlightSearch;
