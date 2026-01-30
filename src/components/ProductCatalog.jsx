import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Info, Search, Factory, ChevronDown, ChevronUp, Target } from 'lucide-react';

const ProductCatalog = ({ onProductClick, lang, t, allProducts = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSub, setActiveSub] = useState('all');
  const [activeSpecies, setActiveSpecies] = useState('all');
  const [activeManufacturer, setActiveManufacturer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isManOpen, setIsManOpen] = useState(false);
  const dropdownRef = useRef(null);

  // მწარმოებლების სია
  const manufacturers = useMemo(() => {
    const list = allProducts.map(p => p.manufacturer);
    return ['all', ...new Set(list)];
  }, [allProducts]);

  // ცხოველების ფილტრის მონაცემები
  const speciesFilters = [
    { id: 'all', label: lang === 'GE' ? 'ყველა' : 'All', icon: "🐾" },
    { id: 'dog', label: lang === 'GE' ? 'ძაღლი' : 'Dog', icon: "🐕" },
    { id: 'cat', label: lang === 'GE' ? 'კატა' : 'Cat', icon: "🐈" },
    { id: 'bird', label: lang === 'GE' ? 'ფრინველი' : 'Bird', icon: "🦜" },
    { id: 'livestock', label: lang === 'GE' ? 'საქონელი' : 'Livestock', icon: "🐄" },
    { id: 'horse', label: lang === 'GE' ? 'ცხენი' : 'Horse', icon: "🐎" }
  ];

  const subFilters = useMemo(() => {
    if (activeCategory === 'pharma') return ['all', 'antibiotic', 'vitamin', 'parasite'];
    if (activeCategory === 'nutrition') return ['all', 'dry_food', 'supplement'];
    return [];
  }, [activeCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsManOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // სრული ფილტრაციის ლოგიკა
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = p.name[lang].toLowerCase().includes(term) || p.manufacturer.toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSub = activeSub === 'all' || p.sub === activeSub;
      const matchesMan = activeManufacturer === 'all' || p.manufacturer === activeManufacturer;
      const matchesSpecies = activeSpecies === 'all' || (p.species && p.species.includes(activeSpecies));

      return matchesCategory && matchesSub && matchesMan && matchesSearch && matchesSpecies;
    });
  }, [activeCategory, activeSub, activeManufacturer, activeSpecies, searchTerm, allProducts, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-950 uppercase">{t.title}</h1>
          <div className="h-1.5 w-14 bg-teal-500 rounded-full mt-2"></div>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'GE' ? 'ძებნა სახელით ან ბრენდით...' : 'Search products...'}
            className="w-full bg-slate-50 border-2 border-teal-100 py-3.5 pl-12 pr-4 rounded-2xl font-bold text-sm focus:border-teal-500 outline-none transition-all"
          />
        </div>
      </div>
      
      {/* ფილტრების პანელი */}
      <div className="space-y-4 mb-10">
        {/* 1. კატეგორიები */}
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: t.all }, { id: 'pharma', label: t.pharma }, { id: 'nutrition', label: t.nutrition }].map(cat => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setActiveSub('all'); }} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${activeCategory === cat.id ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white text-slate-500 border-slate-100 hover:border-teal-200'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2. ცხოველების ფილტრი */}
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
          {speciesFilters.map(s => (
            <button key={s.id} onClick={() => setActiveSpecies(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSpecies === s.id ? 'bg-teal-500 text-white' : 'bg-white text-slate-500 border border-slate-100 hover:border-teal-200'}`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* 3. ქვეკატეგორიები და მწარმოებელი */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-teal-50/30 rounded-[2rem] border-2 border-teal-50">
          <div className="flex flex-wrap gap-2">
            {(subFilters.length > 0 ? subFilters : ['all']).map(s => (
              <button key={s} onClick={() => setActiveSub(s)} 
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSub === s ? 'bg-white text-teal-600 shadow-md border-teal-200' : 'text-teal-700/60 border border-transparent'}`}
              >
                {s === 'all' ? t.all : t[`sub_${s}`]}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px h-8 bg-teal-100/50 mx-2"></div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsManOpen(!isManOpen)} className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${activeManufacturer !== 'all' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-teal-100 text-teal-800'}`}>
              <Factory className="w-3.5 h-3.5" />
              {activeManufacturer === 'all' ? (lang === 'GE' ? 'მწარმოებელი' : 'Manufacturer') : activeManufacturer}
              {isManOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isManOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-teal-100 rounded-2xl shadow-2xl z-50 py-2">
                {manufacturers.map(man => (
                  <button key={man} onClick={() => { setActiveManufacturer(man); setIsManOpen(false); }} className="w-full text-left px-5 py-2.5 text-[10px] font-black uppercase hover:bg-teal-50">
                    {man === 'all' ? t.all : man}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* პროდუქტების ბადე */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredProducts.map(p => (
          <div key={p.id} onClick={() => onProductClick(p)} className="group relative cursor-pointer bg-white border-2 border-teal-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-teal-400 transition-all duration-300 flex flex-col h-full">
            <div className="aspect-square bg-white overflow-hidden relative flex items-center justify-center p-4">
              <img src={p.image} alt="" className="w-full h-full object-contain group-hover:scale-105 transition duration-700" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-slate-50/50 via-teal-50/80 to-teal-100/90 group-hover:from-teal-50 group-hover:to-teal-200/80">
              <span className="text-[8px] font-black text-teal-700 uppercase tracking-widest mb-2 px-2 py-0.5 bg-white/80 rounded-full inline-block w-fit border border-teal-200/50">{p.manufacturer}</span>
              <h3 className="text-[12px] font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-800 line-clamp-3 min-h-[3.2rem] uppercase tracking-tighter">{p.name[lang]}</h3>
              <div className="mt-auto pt-4 border-t border-teal-200/50 flex items-center justify-between">
                <span className="text-base font-black text-slate-950">{p.price.toFixed(1)} <span className="text-teal-600 text-xs italic font-bold">₾</span></span>
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm border border-teal-200"><Info className="w-4 h-4" /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;