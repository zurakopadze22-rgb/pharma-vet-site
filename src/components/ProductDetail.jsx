import React, { useMemo, useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, Truck, RotateCcw, Factory, 
  Package, Info, ChevronDown, BookOpen, Target, Bookmark,
  Globe 
} from 'lucide-react';
import { translations } from "../translations";

const ProductDetail = ({ product, lang, onBack, t, allProducts = [], onProductClick }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const ct = translations[lang].catalog;

  if (!product) return null;

  // 1. ბრენდის სახელი ენის მიხედვით
  const brandName = lang === 'GE' ? 'ფარმავეტი' : lang === 'EN' ? 'Pharma Vet' : 'Фарма Вет';

  // 2. JSON-LD დინამიური მონაცემები
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name[lang],
    "image": `https://pharmavet.ge${product.image}`,
    "description": product.purpose?.[lang] || "",
    "brand": {
      "@type": "Brand",
      "name": product.manufacturer
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GEL",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-01-01"
    }
  };

  const speciesData = {
    dog: { icon: "🐕", label: ct.species_dog },
    cat: { icon: "🐈", label: ct.species_cat },
    bird: { icon: "🦜", label: ct.species_bird },
    livestock: { icon: "🐄", label: ct.species_livestock },
    horse: { icon: "🐎", label: ct.species_horse }
  };

  const similarProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      
      {/* --- SEO & Metadata (React 19) --- */}
      {/* სათაური ახლა ენის მიხედვით იცვლება სრულად */}
      <title>{`${product.name[lang]} | ${brandName}`}</title>
      
      {/* აღწერა ენის მიხედვით */}
      <meta name="description" content={`${product.name[lang]} - ${product.purpose?.[lang]}`} />
      
      {/* სოციალური ქსელებისთვის (Open Graph) */}
      <meta property="og:title" content={`${product.name[lang]} - ${brandName}`} />
      <meta property="og:description" content={product.purpose?.[lang]} />
      <meta property="og:locale" content={lang === 'GE' ? 'ka_GE' : lang === 'EN' ? 'en_US' : 'ru_RU'} />
      <meta property="og:image" content={`https://pharmavet.ge${product.image}`} />
      
      {/* გუგლის სტრუქტურირებული მონაცემები */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* უკან დაბრუნების ღილაკი */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[9px] uppercase mb-6 transition-all active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
      </button>

      {/* ... დანარჩენი ვიზუალური კოდი იგივეა ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">
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
          {/* ფიჩერები */}
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

        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block border border-teal-100">
              {product.manufacturer}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 mb-4 tracking-tighter leading-tight uppercase">
              {product.name[lang]}
            </h1>
            <div className="inline-flex items-center bg-teal-500 text-white px-6 py-2 rounded-xl shadow-lg">
              <span className="text-2xl font-black">{product.price.toFixed(1)} ₾</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3">
              <Factory className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.manufacturer_label}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.manufacturer}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3">
              <Globe className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.exporter_label || "ექსპორტიორი"}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.exporter || "Pharma Vet"}</p>
              </div>
            </div>
            {/* ... სხვა ბლოკები ... */}
          </div>
          
          <div className="mb-6 bg-teal-50/50 p-5 rounded-[1.5rem] border border-teal-100">
            <h3 className="text-[10px] font-black text-teal-700 uppercase mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> {t.usage_label}
            </h3>
            <p className="text-teal-900 text-xs font-bold leading-relaxed whitespace-pre-line">
              {product.usage?.[lang]}
            </p>
          </div>
          {/* აკორდეონი */}
          <div className="border-2 border-slate-100 rounded-[1.5rem] overflow-hidden bg-white mb-8">
            <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-teal-600" /><span className="font-black text-[10px] uppercase tracking-widest text-slate-900">{t.full_details_btn}</span></div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${isDetailsOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 text-slate-500 text-[11px] leading-relaxed border-t border-slate-100 bg-slate-50/30 whitespace-pre-line">{product.fullDetails?.[lang]}</div>
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
              <div key={item.id} onClick={() => onProductClick(item)} className="group cursor-pointer bg-white border-2 border-teal-50 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                <div className="aspect-square p-4 flex items-center justify-center bg-white">
                  <img src={item.image} alt={item.name[lang]} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"/>
                </div>
                <div className="p-4 bg-slate-50/50">
                   <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase line-clamp-2 min-h-[2rem] mb-2">{item.name[lang]}</h4>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-teal-600">{item.price.toFixed(1)} ₾</span>
                      <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-colors"><Info className="w-3 h-3" /></div>
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