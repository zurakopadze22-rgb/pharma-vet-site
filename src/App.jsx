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
import PartnerDetail from './components/PartnerDetail'; // <--- ეს აუცილებელია!
import BecomePartner from './components/BecomePartner';

// იმპორტები გარე ფაილებიდან
import { translations } from './translations';
import { productsData } from './data/products';

const App = () => {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState('GE'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const t = translations[lang]; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProduct]);

  // პროდუქტის დეტალური გვერდის გახსნა
  const openProduct = (product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };
  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner); // ვიმახსოვრებთ რომელ პარტნიორს დააჭირეს
    setView('partner-detail');   // გადავდივართ დეტალურ გვერდზე
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
      />

      <main>
        {view === 'home' && (
          <>
            <Hero t={t.hero} setView={setView} />
            <Shop t={t.shop} lang={lang} products={productsData} onProductClick={openProduct} />
            <TrustSection lang={lang} /> {/* ნდობის სექცია Shop-ის ქვემოთ */}
            <BrandsSlider lang={lang} /> {/* ბრენდები Hero-ს ქვემოთ */}
          </>
        )}

        {/* სრული კატალოგის გვერდი */}
        {view === 'products' && (
          <ProductCatalog 
            t={t.catalog} 
            lang={lang} 
            allProducts={productsData}
            onProductClick={openProduct} 
          />
        )}

        {/* დეტალური გვერდი */}
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

        {/* სხვა გვერდები */}
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