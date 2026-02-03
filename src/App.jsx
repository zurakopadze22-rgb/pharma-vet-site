import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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

import { translations } from './translations';
import { productsData } from './data/products';

const App = () => {
  const [lang, setLang] = useState('GE'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const t = translations[lang]; 

  // გვერდის გადასვლისას ავტომატურად ზემოთ ატანა
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // პროდუქტზე დაჭერა - გადადის დინამიურ სლაგზე
  const handleProductClick = (product) => {
    navigate(`/product/${product.slug}`);
  };

  // ბლოგზე დაჭერა
  const handleArticleClick = (article) => {
    navigate(`/blog/${article.slug}`);
  };

  // პარტნიორზე დაჭერა (შეგიძლია ესეც სლაგზე გადაიყვანო მომავალში)
  const handlePartnerClick = (partner) => {
    navigate('/partner-detail', { state: { partner } });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t.navbar} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setView={(path) => navigate(path === 'home' ? '/' : `/${path}`)}
        view={location.pathname === '/' ? 'home' : location.pathname.substring(1).split('/')[0]}
      />

      <main>
        <Routes>
          {/* მთავარი გვერდი */}
          <Route path="/" element={
            <>
              <Hero t={t.hero} setView={(path) => navigate(`/${path}`)} />
              <Shop t={t.shop} lang={lang} products={productsData} onProductClick={handleProductClick} />
              <TrustSection lang={lang} />
              <BrandsSlider lang={lang} />
            </>
          } />

          {/* ბლოგის სექცია */}
          <Route path="/blog" element={
            <Blog 
              lang={lang} 
              t={t} 
              onArticleClick={handleArticleClick} 
            />
          } />

          <Route path="/blog/:slug" element={
            <BlogDetail 
              lang={lang} 
              t={t} 
              onBack={() => navigate('/blog')} 
            />
          } />

          {/* პროდუქტების კატალოგი */}
          <Route path="/products" element={
            <ProductCatalog 
              t={t.catalog} 
              lang={lang} 
              allProducts={productsData} 
              onProductClick={handleProductClick} 
            />
          } />
          
          {/* პროდუქტის შიდა გვერდი - ახლა უკვე სლაგით */}
          <Route path="/product/:slug" element={
            <ProductDetail 
              allProducts={productsData} 
              lang={lang}
              t={t.detail} 
              onProductClick={handleProductClick}
              onBack={() => navigate('/products')} 
            />
          } />

          {/* პარტნიორების სექცია */}
          <Route path="/partners" element={
            <Partners 
              lang={lang} 
              t={t.partners} 
              onPartnerClick={handlePartnerClick} 
            />
          } />
          
          <Route path="/partner-detail" element={
            <PartnerDetail 
              partner={location.state?.partner} 
              lang={lang} 
              t={t.partners} 
              onBack={() => navigate('/partners')} 
            />
          } />

          <Route path="/become-partner" element={<BecomePartner lang={lang} t={t.becomePartner} />} />
          <Route path="/about" element={<AboutUs t={t.about} lang={lang} />} />
          
          {/* 404 ან გაურკვეველი მისამართის რეRedirect მთავარზე */}
          <Route path="*" element={<Hero t={t.hero} setView={(path) => navigate(`/${path}`)} />} />
        </Routes>
      </main>

      <Footer t={t.footer} />
      <Analytics />
    </div>
  );
};

export default App;