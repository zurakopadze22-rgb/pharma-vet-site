import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// Context Providers
import { ToastProvider } from './context/ToastContext';

// Modals
import SpotlightSearch from './components/SpotlightSearch';

// მთავარი საიტის კომპონენტები
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './components/Shop';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import Partners from './components/Partners';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import TrustSection from './components/TrustSection'; 
import BrandsSlider from './components/BrandsSlider'; 
import PartnerDetail from './components/PartnerDetail';
import BecomePartner from './components/BecomePartner';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';

// მონაცემები
import { translations } from './translations';
import { getStoredProducts } from './utils/productStore';

// 🚀 შიდა პანელები
import DistributionDashboard from './components/DistributionDashboard'; 
import CourierDashboard from './components/CourierDashboard';

const AppContent = () => {
  // Dynamic Products State from localStorage / initial catalog
  const [products, setProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('pharmavet_products_updated', handleUpdate);
    return () => window.removeEventListener('pharmavet_products_updated', handleUpdate);
  }, []);

  // Language Persistence in localStorage
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('pharmavet_lang') || 'GE';
    } catch (e) {
      return 'GE';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('pharmavet_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const t = translations[lang]; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleProductClick = (product) => navigate(`/product/${product.slug}`);
  const handleArticleClick = (article) => navigate(`/blog/${article.slug}`);
  const handlePartnerClick = (partner) => navigate('/partner-detail', { state: { partner } });

  // ამოწმებს, შიდა პანელებში ვართ თუ არა
  const isDashboardPage = location.pathname === '/admin' || location.pathname === '/courier';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* ნავბარი დაიმალება, როცა ვართ შიდა პანელებში */}
      {!isDashboardPage && (
        <Navbar 
          lang={lang} setLang={setLang} t={t.navbar} 
          isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
          onOpenSearch={() => setIsSearchOpen(true)}
          setView={(path) => navigate(path === 'home' ? '/' : `/${path}`)}
          view={location.pathname === '/' ? 'home' : location.pathname.substring(1).split('/')[0]}
        />
      )}

      <main>
        <Routes>
          {/* ================= მთავარი საიტი ================= */}
          <Route path="/" element={
            <>
              <Hero t={t.hero} lang={lang} setView={(path) => navigate(`/${path}`)} />
              <Shop t={t.shop} lang={lang} products={products} onProductClick={handleProductClick} />
              <TrustSection lang={lang} />
              <BrandsSlider lang={lang} />
            </>
          } />

          <Route path="/products" element={<ProductCatalog t={t.catalog} lang={lang} allProducts={products} onProductClick={handleProductClick} />} />
          <Route path="/product/:slug" element={
            <ProductDetail 
              allProducts={products} 
              lang={lang} 
              t={t.detail} 
              onProductClick={handleProductClick} 
              onBack={() => navigate('/products')}
            />
          } />
          <Route path="/partners" element={<Partners lang={lang} t={t.partners} onPartnerClick={handlePartnerClick} />} />
          <Route path="/partner-detail" element={<PartnerDetail partner={location.state?.partner} lang={lang} t={t.partners} onBack={() => navigate('/partners')} />} />
          <Route path="/become-partner" element={<BecomePartner lang={lang} t={t.becomePartner} />} />
          <Route path="/about" element={<AboutUs t={t.about} lang={lang} />} />
          <Route path="/blog" element={<Blog lang={lang} t={t} onArticleClick={handleArticleClick} />} />
          <Route path="/blog/:slug" element={<BlogDetail lang={lang} t={t} onBack={() => navigate('/blog')} />} />
          
          {/* ================= 🚀 დისტრიბუციის პანელი ================= */}
          <Route path="/admin" element={<DistributionDashboard />} />

          {/* ================= 🚀 კურიერის პანელი ================= */}
          <Route path="/courier" element={<CourierDashboard />} />

          {/* 404 რე-დირექტი */}
          <Route path="*" element={<Hero t={t.hero} setView={(path) => navigate(`/${path}`)} />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} lang={lang} />

      {/* ფუტერი დაიმალება, როცა ვართ შიდა პანელებში */}
      {!isDashboardPage && <Footer t={t.footer} />}
      <Analytics />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;