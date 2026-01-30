import React, { useState, useEffect } from 'react';
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

import { translations } from './translations';
import { productsData } from './data/products';

const App = () => {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState('GE'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  // მობილური მენიუს კონტროლი
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const t = translations[lang]; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProduct]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner);
    setView('partner-detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar 
        view={view} 
        setView={setView} 
        lang={lang} 
        setLang={setLang} 
        t={t.navbar} 
        isMenuOpen={isMenuOpen}       // გადავცემთ მნიშვნელობას
        setIsMenuOpen={setIsMenuOpen} // გადავცემთ ფუნქციას
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

        {view === 'products' && (
          <ProductCatalog 
            t={t.catalog} 
            lang={lang} 
            allProducts={productsData}
            onProductClick={openProduct} 
          />
        )}

        {view === 'product-detail' && (
          <ProductDetail 
            product={selectedProduct} 
            allProducts={productsData} 
            lang={lang}
            t={t.detail} 
            onProductClick={openProduct}
            onBack={() => setView('home')} 
          />
        )}

        {view === 'partners' && (
          <Partners 
            lang={lang} 
            t={t.partners} 
            onPartnerClick={handlePartnerClick} 
          />
        )}

        {view === 'partner-detail' && (
          <PartnerDetail 
            partner={selectedPartner} 
            lang={lang} 
            t={t.partners} 
            onBack={() => setView('partners')} 
          />
        )}

        {view === 'become-partner' && (
          <BecomePartner 
            lang={lang} 
            t={t.becomePartner} 
          />
        )}

        {view === 'about' && <AboutUs t={t.about} lang={lang} />}
      </main>

      <Footer t={t.footer} />
    </div>
  );
};

export default App;