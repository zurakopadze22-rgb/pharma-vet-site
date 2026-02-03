import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Truck, RotateCcw, Factory, 
  Package, Info, ChevronDown, BookOpen, Globe 
} from 'lucide-react';
import { translations } from "../translations";

const ProductDetail = ({ lang, allProducts = [], onProductClick, t }) => {
  const { slug } = useParams(); // URL-დან ვიღებთ პროდუქტის სლაგს
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const ct = translations[lang].catalog;

  // პროდუქტის მოძებნა სლაგის მიხედვით
  const product = useMemo(() => {
    return allProducts.find(p => p.slug === slug);
  }, [slug, allProducts]);

  // თუ პროდუქტი არ მოიძებნა, გადავიყვანოთ კატალოგზე (ან ვაჩვენოთ ერორი)
  useEffect(() => {
    if (!product && allProducts.length > 0) {
      navigate('/products');
    }
    // გვერდის გახსნისას ყოველთვის ზემოთ ატანა
    window.scrollTo(0, 0);
  }, [product, allProducts, navigate]);

  if (!product) return null;

  const brandName = lang === 'GE' ? 'ფარმავეტი' : lang === 'EN' ? 'Pharma Vet' : 'Фарма Вет';

  const getSubCategoryLabel = (sub) => {
    if (!sub) return null;
    const key = `sub_${sub}`;
    return ct[key] || sub;
  };

  const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name[lang],
  "image": product.image.startsWith('http') ? product.image : `https://www.pharmavet.ge${product.image}`,
  "description": product.purpose?.[lang] || "",
  "brand": {
    "@type": "Brand",
    "name": product.manufacturer
  },
  "offers": {
    "@type": "Offer",
    "url": window.location.href,
    "priceCurrency": "GEL",
    "price": product.price.toString(),
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  // დაამატე ესენიც "Merchant Listings"-ისთვის
  "sku": `PV-${product.id}`,
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "1"
  }
};
  useEffect(() => {
  if (product) {
    // ტაბის სახელის შეცვლა
    document.title = `${product.name[lang]} | ${brandName}`;
    
    // OG Meta Tags (გაზიარებისთვის)
    const updateMeta = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('og:title', product.name[lang]);
    updateMeta('og:description', product.purpose?.[lang] || "");
    updateMeta('og:image', `https://www.pharmavet.ge${product.image}`);
  }
}, [product, lang, brandName,slug]);

  const similarProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      
      {/* --- SEO & Metadata --- */}
      {/* გაითვალისწინე: React Helmet-ის გარეშე title ტეგი JSX-ში პირდაპირ არ იმუშავებს, 
          თუმცა სტრუქტურულად აქ იყოს */}
      <title>{`${product.name[lang]} | ${brandName}`}</title>
      
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <button 
        onClick={() => navigate('/products')} 
        className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[9px] uppercase mb-6 transition-all active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">
        
        {/* სურათის სექცია */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative w-full max-w-[420px] mb-8">
            <div className="border-[4px] border-teal-100 rounded-[2.5rem] overflow-hidden shadow-xl bg-white aspect-square flex items-center justify-center p-6">
              <img 
                src={product.image} 
                className="w-full h-full object-contain hover:scale-105 transition duration-700" 
                alt={`${product.name[lang]} - ${brandName}`} 
              />
            </div>
          </div>

          {/* უპირატესობების აიქონები */}
          <div className="w-full max-w-[420px] flex justify-between px-2 opacity-80">
            {[{ Icon: ShieldCheck, txt: t.feat1 }, { Icon: Truck, txt: t.feat2 }, { Icon: RotateCcw, txt: t.feat3 }].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                  <item.Icon className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-[7px] font-black uppercase tracking-tighter leading-tight max-w-[60px]">{item.txt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ინფორმაციის სექცია */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
                {product.manufacturer}
              </span>
              {product.sub && (
                <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
                  {getSubCategoryLabel(product.sub)}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-slate-950 mb-6 tracking-tighter leading-tight uppercase">
              {product.name[lang]}
            </h1>

            <div className="flex flex-wrap gap-4 items-stretch mb-6">
              <div className="bg-teal-600 text-white px-7 py-4 rounded-[1.8rem] shadow-lg shadow-teal-100 flex flex-col justify-center min-w-[130px]">
                <span className="text-[8px] font-black uppercase opacity-70 mb-1 tracking-widest">
                  {lang === 'GE' ? 'ღირებულება' : lang === 'EN' ? 'Price' : 'Цена'}
                </span>
                <span className="text-2xl font-black leading-none tracking-tighter">
                  {product.price.toFixed(1)} ₾
                </span>
              </div>

              <div className="bg-white border-2 border-slate-100 px-7 py-4 rounded-[1.8rem] flex flex-col justify-center min-w-[150px] hover:border-teal-100 transition-colors shadow-sm">
                <span className="text-[8px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5 tracking-widest">
                  <Package className="w-3.5 h-3.5 text-teal-500" /> 
                  {lang === 'GE' ? 'მოცულობა' : lang === 'EN' ? 'Volume' : 'Объем'}
                </span>
                <span className="text-lg font-black text-slate-900 leading-none">
                  {product.volume?.[lang]}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/30 flex items-center gap-3">
              <Factory className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.manufacturer_label}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.manufacturer}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/30 flex items-center gap-3">
              <Globe className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.exporter_label || "ექსპორტიორი"}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.exporter || "Pharma Vet"}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 bg-teal-50/50 p-5 rounded-[1.5rem] border border-teal-100">
            <h3 className="text-[10px] font-black text-teal-700 uppercase mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> {lang === 'GE' ? 'დანიშნულება' : lang === 'EN' ? 'Purpose' : 'Назначение'}
            </h3>
            <p className="text-teal-900 text-xs font-bold leading-relaxed whitespace-pre-line">
              {product.purpose?.[lang]}
            </p>
          </div>

          <div className="border-2 border-slate-100 rounded-[1.5rem] overflow-hidden bg-white mb-8">
            <button 
              onClick={() => setIsDetailsOpen(!isDetailsOpen)} 
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">{t.full_details_btn}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${isDetailsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 text-slate-600 text-[11px] leading-relaxed border-t border-slate-100 bg-slate-50/30 whitespace-pre-line font-medium">
                {product.fullDetails?.[lang]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* მსგავსი პროდუქტები */}
      {similarProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-100">
          <h2 className="text-2xl font-black text-slate-950 mb-8 uppercase tracking-tighter">
             {lang === 'GE' ? 'მსგავსი პროდუქცია' : lang === 'EN' ? 'Similar Products' : 'Похожие товары'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {similarProducts.map((item) => (
              <div 
  key={item.id} 
  onClick={() => {
    navigate(`/product/${item.slug}`);
    window.scrollTo(0, 0); // ეს უზრუნველყოფს, რომ გვერდი თავში ავიდეს
  }} 
  className="group cursor-pointer bg-white border-2 border-teal-50 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all duration-300"
>
  <div className="aspect-square p-4 flex items-center justify-center bg-white">
    <img src={item.image} alt={item.name[lang]} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"/>
  </div>
  <div className="p-4 bg-slate-50/50">
     <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase line-clamp-2 min-h-[2rem] mb-2">{item.name[lang]}</h4>
     <div className="flex justify-between items-center">
        <span className="text-xs font-black text-teal-600">{item.price.toFixed(1)} ₾</span>
        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-colors">
          <Info className="w-3 h-3" />
        </div>
     </div>
  </div>
</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;