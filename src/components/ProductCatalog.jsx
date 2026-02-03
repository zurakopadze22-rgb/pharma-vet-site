import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Info, Search, Factory, ChevronDown, ChevronUp, Target, Filter } from 'lucide-react';

const ProductCatalog = ({ onProductClick, lang, t, allProducts = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSub, setActiveSub] = useState('all');
  const [activeSpecies, setActiveSpecies] = useState('all');
  const [activeManufacturer, setActiveManufacturer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isManOpen, setIsManOpen] = useState(false);
  const dropdownRef = useRef(null);

  const manufacturers = useMemo(() => {
    const list = allProducts.map(p => p.manufacturer);
    return ['all', ...new Set(list)];
  }, [allProducts]);

  const availableSubs = useMemo(() => {
    let subs = [];
    if (activeCategory === 'all') {
      subs = allProducts.map(p => p.sub).filter(Boolean);
    } else {
      subs = allProducts
        .filter(p => p.category === activeCategory)
        .map(p => p.sub)
        .filter(Boolean);
    }
    return ['all', ...new Set(subs)];
  }, [activeCategory, allProducts]);

  const speciesFilters = [
    { id: 'all', label: lang === 'GE' ? 'ყველა' : 'All', icon: "🐾" },
    { id: 'dog', label: lang === 'GE' ? 'ძაღლი' : 'Dog', icon: "🐕" },
    { id: 'cat', label: lang === 'GE' ? 'კატა' : 'Cat', icon: "🐈" },
    { id: 'bird', label: lang === 'GE' ? 'ფრინველი' : 'Bird', icon: "🦜" },
    { id: 'livestock', label: lang === 'GE' ? 'საქონელი' : 'Livestock', icon: "🐄" },
    { id: 'horse', label: lang === 'GE' ? 'ცხენი' : 'Horse', icon: "🐎" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsManOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- განახლებული "ღრმა ფილტრაციის" ლოგიკა ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const term = searchTerm.toLowerCase().trim();
      
      if (!term) {
        // თუ ძებნა ცარიელია, მხოლოდ ფილტრებს ვადარებთ
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSub = activeSub === 'all' || p.sub === activeSub;
        const matchesMan = activeManufacturer === 'all' || p.manufacturer === activeManufacturer;
        const matchesSpecies = activeSpecies === 'all' || (p.species && p.species.includes(activeSpecies));
        return matchesCategory && matchesSub && matchesMan && matchesSpecies;
      }

      // 1. ძებნა სახელებში (სამივე ენაზე)
      const inNames = Object.values(p.name || {}).some(val => val.toLowerCase().includes(term));
      
      // 2. ძებნა დანიშნულებაში (purpose) (სამივე ენაზე)
      const inPurpose = Object.values(p.purpose || {}).some(val => val.toLowerCase().includes(term));
      
      // 3. ძებნა სრულ აღწერაში (fullDetails) (სამივე ენაზე)
      const inDetails = Object.values(p.fullDetails || {}).some(val => val.toLowerCase().includes(term));
      
      // 4. ძებნა მწარმოებელში
      const inManufacturer = p.manufacturer.toLowerCase().includes(term);

      const matchesSearch = inNames || inPurpose || inDetails || inManufacturer;

      // სხვა ფილტრები
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSub = activeSub === 'all' || p.sub === activeSub;
      const matchesMan = activeManufacturer === 'all' || p.manufacturer === activeManufacturer;
      const matchesSpecies = activeSpecies === 'all' || (p.species && p.species.includes(activeSpecies));

      return matchesSearch && matchesCategory && matchesSub && matchesMan && matchesSpecies;
    });
  }, [activeCategory, activeSub, activeManufacturer, activeSpecies, searchTerm, allProducts, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* სათაური და ძებნა */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-950 uppercase">{t.title}</h1>
          <div className="h-1.5 w-14 bg-teal-500 rounded-full mt-2"></div>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5 group-focus-within:scale-110 transition-transform" />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'GE' ? 'ძებნა (მაგ: სიცხე, ანტიბიოტიკი, ვიტამინი...)' : 'Search (e.g. fever, antibiotic, vitamin...)'}
            className="w-full bg-slate-50 border-2 border-teal-100 py-3.5 pl-12 pr-4 rounded-2xl font-bold text-sm focus:border-teal-500 focus:bg-white outline-none transition-all shadow-sm"
          />
        </div>
      </div>
      
      {/* ფილტრების პანელი */}
      <div className="space-y-4 mb-10">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[{ id: 'all', label: t.all }, { id: 'pharma', label: t.pharma }, { id: 'nutrition', label: t.nutrition }].map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setActiveSub('all'); }} 
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeCategory === cat.id ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsManOpen(!isManOpen)} className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${activeManufacturer !== 'all' ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-teal-100 text-teal-800 hover:border-teal-300'}`}>
              <Factory className="w-3.5 h-3.5" />
              {activeManufacturer === 'all' ? (lang === 'GE' ? 'ბრენდი' : 'Brand') : activeManufacturer}
              {isManOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isManOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-teal-100 rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2">
                {manufacturers.map(man => (
                  <button key={man} onClick={() => { setActiveManufacturer(man); setIsManOpen(false); }} className="w-full text-left px-5 py-2.5 text-[10px] font-black uppercase hover:bg-teal-50 transition-colors">
                    {man === 'all' ? t.all : man}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {availableSubs.length > 1 && (
          <div className="flex flex-wrap gap-2 p-1.5 bg-teal-50/30 rounded-2xl border border-teal-100/50">
            {availableSubs.map(s => (
              <button key={s} onClick={() => setActiveSub(s)} 
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeSub === s ? 'bg-teal-500 text-white shadow-md' : 'bg-white text-teal-700/60 border border-teal-100 hover:bg-teal-50'}`}
              >
                {s === 'all' ? (lang === 'GE' ? 'ყველა ტიპი' : 'All Types') : t[`sub_${s}`] || s}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
          {speciesFilters.map(s => (
            <button key={s.id} onClick={() => setActiveSpecies(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSpecies === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:border-teal-200'}`}
            >
              <span className="text-sm">{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* პროდუქტების ბადე */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => onProductClick(p)} className="group relative cursor-pointer bg-white border-2 border-teal-50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-teal-400 transition-all duration-500 flex flex-col h-full">
              <div className="aspect-square bg-white overflow-hidden relative flex items-center justify-center p-6">
                <img src={p.image} alt={p.name[lang]} className="w-full h-full object-contain group-hover:scale-110 transition duration-700" />
                {p.sub && (
                   <div className="absolute top-4 right-4 bg-teal-500 text-white text-[7px] font-black uppercase px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                     {t[`sub_${p.sub}`]}
                   </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow bg-slate-50/50 group-hover:bg-white transition-colors">
                <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest mb-2 px-2 py-0.5 bg-teal-50 rounded-full inline-block w-fit border border-teal-100">{p.manufacturer}</span>
                <h3 className="text-[11px] md:text-[12px] font-black text-slate-900 mb-4 leading-tight line-clamp-2 min-h-[2.2rem] uppercase tracking-tighter">{p.name[lang]}</h3>
                
                {/* ძებნის დროს ვაჩვენებთ თუ დანიშნულებაში რამე დაემთხვა */}
                {searchTerm && p.purpose[lang].toLowerCase().includes(searchTerm.toLowerCase()) && (
                  <p className="text-[9px] text-slate-400 italic mb-4 line-clamp-1">
                    ...{p.purpose[lang]}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-slate-950">{p.price.toFixed(1)} <span className="text-teal-600 text-xs italic font-bold">₾</span></span>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm border border-teal-100"><Info className="w-4 h-4" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">პროდუქცია ვერ მოიძებნა</p>
          <button onClick={() => {setSearchTerm(''); setActiveCategory('all');}} className="mt-4 text-teal-600 font-black text-[10px] uppercase underline">ფილტრების გასუფთავება</button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;