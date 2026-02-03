import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react'; // <-- დავამატეთ ანალიტიკა
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
  const [view, setView] = useState('home');
  const [lang, setLang] = useState('GE'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const t = translations[lang]; 

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // URL-ის განახლება view-ს მიხედვით
    if (view === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/#${view}`);
    }
  }, [view, selectedProduct, selectedArticle]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
    setView('blog-detail');
  };

  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner);
    setView('partner-detail');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar 
        view={view} 
        setView={setView} 
        lang={lang} 
        setLang={setLang} 
        t={t.navbar} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main>
        {view === 'home' && (
          <>
            <Hero t={t.hero} setView={setView} />
            <Shop t={t.shop} lang={lang} products={productsData} onProductClick={openProduct} />
            <TrustSection lang={lang} />
            <BrandsSlider lang={lang} />
          </>
        )}

        {view === 'blog' && (
          <Blog lang={lang} t={t} onArticleClick={openArticle} />
        )}

        {view === 'blog-detail' && (
          <BlogDetail 
            article={selectedArticle} 
            lang={lang} 
            t={t} 
            onBack={() => setView('blog')} 
          />
        )}

        {view === 'products' && (
          <ProductCatalog t={t.catalog} lang={lang} allProducts={productsData} onProductClick={openProduct} />
        )}

        {view === 'product-detail' && (
          <ProductDetail 
            product={selectedProduct} 
            allProducts={productsData} 
            lang={lang}
            t={t.detail} 
            onProductClick={openProduct}
            onBack={() => setView('products')} 
          />
        )}

        {view === 'partners' && <Partners lang={lang} t={t.partners} onPartnerClick={handlePartnerClick} />}
        {view === 'partner-detail' && <PartnerDetail partner={selectedPartner} lang={lang} t={t.partners} onBack={() => setView('partners')} />}
        {view === 'become-partner' && <BecomePartner lang={lang} t={t.becomePartner} />}
        {view === 'about' && <AboutUs t={t.about} lang={lang} />}
      </main>

      <Footer t={t.footer} />
      
      {/* Vercel Analytics - აღრიცხავს ვიზიტებს ყველა გვერდზე */}
      <Analytics />
    </div>
  );
};

export default App;