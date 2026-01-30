import React, { useMemo, useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, Truck, RotateCcw, Factory, 
  Package, Info, ChevronDown, BookOpen, Target, Bookmark,
  Globe // დავამატე Globe ხატულა ექსპორტიორისთვის
} from 'lucide-react';
import { translations } from "../translations";

const ProductDetail = ({ product, lang, onBack, t, allProducts = [], onProductClick }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const ct = translations[lang].catalog;

  if (!product) return null;

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
      .slice(0, 5);
  }, [product, allProducts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[9px] uppercase mb-6 transition-all active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-12">
        
        {/* მარცხენა სვეტი */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative w-full max-w-[420px] mb-8">
            <div className="border-[4px] border-teal-100 rounded-[2.5rem] overflow-hidden shadow-xl bg-white aspect-square flex items-center justify-center p-6">
              <img 
                src={product.image} 
                className="w-full h-full object-contain hover:scale-105 transition duration-700" 
                alt={product.name[lang] || product.name.EN} 
              />
            </div>
          </div>

          <div className="w-full max-w-[420px] flex justify-between px-2 opacity-80">
            {[
              { Icon: ShieldCheck, txt: t.feat1 },
              { Icon: Truck, txt: t.feat2 },
              { Icon: RotateCcw, txt: t.feat3 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                  <item.Icon className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-[7px] font-black uppercase tracking-tighter leading-tight max-w-[60px]">
                  {item.txt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* მარჯვენა სვეტი */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block border border-teal-100">
              {product.manufacturer}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 mb-4 tracking-tighter leading-tight uppercase">
              {product.name[lang] || product.name.EN}
            </h1>
            <div className="inline-flex items-center bg-teal-500 text-white px-6 py-2 rounded-xl shadow-lg">
              <span className="text-2xl font-black">{product.price.toFixed(1)} ₾</span>
            </div>
          </div>

          {/* ბარათების ბადე (2x2 განლაგება) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* მწარმოებელი */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3 transition-all hover:border-teal-400">
              <div className="bg-white p-2 rounded-xl text-teal-600 shadow-sm">
                <Factory className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t.manufacturer_label}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.manufacturer}</p>
              </div>
            </div>

            {/* ექსპორტიორი (ახალი) */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3 transition-all hover:border-teal-400">
              <div className="bg-white p-2 rounded-xl text-teal-600 shadow-sm">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t.exporter_label || "ექსპორტიორი"}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.exporter || "Pharma Vet"}</p>
              </div>
            </div>

            {/* მოცულობა */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3 transition-all hover:border-teal-400">
              <div className="bg-white p-2 rounded-xl text-teal-600 shadow-sm">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t.volume_label}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">{product.volume?.[lang] || product.volume?.EN}</p>
              </div>
            </div>

            {/* ტიპი */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/50 flex items-center gap-3 transition-all hover:border-teal-400">
              <div className="bg-white p-2 rounded-xl text-teal-600 shadow-sm">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t.type_label}</p>
                <p className="text-[11px] font-black text-slate-900 leading-none">
                   {ct[`sub_${product.sub}`] || product.sub}
                </p>
              </div>
            </div>
          </div>

          {/* დანარჩენი სექციები უცვლელია... */}
          {/* სამიზნე სახეობები */}
          {product.species && (
            <div className="mb-6 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-teal-500" /> {t.species_label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.species.map(s => (
                  <div key={s} className="bg-white px-3 py-1.5 rounded-xl border border-teal-100 flex items-center gap-2 shadow-sm">
                    <span className="text-sm">{speciesData[s]?.icon}</span>
                    <span className="text-[10px] font-black text-slate-700 uppercase">
                      {speciesData[s]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 pl-4 border-l-4 border-teal-500">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.desc_title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {product.purpose?.[lang] || product.purpose?.EN}
            </p>
          </div>

          <div className="mb-6 bg-teal-50/50 p-5 rounded-[1.5rem] border border-teal-100">
            <h3 className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> {t.usage_label}
            </h3>
            <p className="text-teal-900 text-xs font-bold leading-relaxed whitespace-pre-line">
              {product.usage?.[lang] || product.usage?.EN}
            </p>
          </div>

          <div className="border-2 border-slate-100 rounded-[1.5rem] overflow-hidden bg-white">
            <button 
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">
                  {t.full_details_btn}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDetailsOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 text-slate-500 text-[11px] leading-relaxed font-medium border-t border-slate-100 bg-slate-50/30 whitespace-pre-line">
                {product.fullDetails?.[lang] || product.fullDetails?.EN}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;