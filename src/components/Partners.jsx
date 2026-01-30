import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, Phone, ChevronRight, MapPinned, Search, ChevronDown, Factory } from 'lucide-react';
import { partnersData } from '../data/partners';

const Partners = ({ lang, t, onPartnerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ქალაქების უნიკალური სიის ამოღება მონაცემებიდან
  const cities = useMemo(() => {
    const cityList = partnersData.map(p => p.city);
    return ['all', ...new Set(cityList)];
  }, []);

  // ფილტრაციის ლოგიკა (სახელი, მისამართი და ქალაქი)
  const filteredPartners = useMemo(() => {
    return partnersData.filter(p => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        p.name[lang].toLowerCase().includes(term) || 
        p.address[lang].toLowerCase().includes(term);
      
      const matchesCity = selectedCity === 'all' || p.city === selectedCity;
      
      return matchesSearch && matchesCity;
    });
  }, [searchTerm, selectedCity, lang]);

  // Dropdown-ის გარეთ კლიკზე დახურვა
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="py-10 bg-white min-h-screen">
      <div className="max-w-[98%] mx-auto px-4">
        
        {/* სათაური და ძებნის პანელი */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="border-l-8 border-teal-500 pl-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase mb-2">
              {t.title}
            </h2>
            <p className="text-slate-500 text-sm font-bold italic">{t.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* ძებნის ველი */}
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-4 h-4" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'GE' ? 'ძებნა სახელით ან მისამართით...' : 'Search by name or address...'}
                className="w-full bg-slate-50 border-2 border-teal-100 py-3 pl-10 pr-4 rounded-2xl font-bold text-xs focus:border-teal-500 outline-none transition-all"
              />
            </div>

            {/* ქალაქების Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsCityOpen(!isCityOpen)}
                className={`w-full sm:w-48 flex items-center justify-between px-5 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                  selectedCity !== 'all' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-teal-100 text-teal-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  {selectedCity === 'all' ? (lang === 'GE' ? 'ყველა ქალაქი' : 'All Cities') : selectedCity}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-teal-100 rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2">
                  {cities.map(city => (
                    <button 
                      key={city} 
                      onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                      className={`w-full text-left px-5 py-2.5 text-[10px] font-black uppercase hover:bg-teal-50 transition-colors ${selectedCity === city ? 'text-teal-600 bg-teal-50' : 'text-slate-600'}`}
                    >
                      {city === 'all' ? (lang === 'GE' ? 'ყველა ქალაქი' : 'All Cities') : city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* პარტნიორების ბადე */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <div 
                key={partner.id} 
                onClick={() => onPartnerClick(partner)} 
                className="group relative cursor-pointer bg-slate-50 border-2 border-teal-100/50 rounded-[1.5rem] overflow-hidden hover:border-teal-500 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={partner.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-3 right-3 bg-teal-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase shadow-md">
                    {partner.workHours}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 p-1.5 rounded-lg text-teal-600 shadow-sm">
                    <MapPinned className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-slate-50 via-slate-50 to-teal-50/50 group-hover:to-teal-100/60 transition-all">
                  <h3 className="text-sm font-black text-slate-900 mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-700 transition-colors leading-tight">
                    {partner.name[lang]}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="font-bold text-[9px] line-clamp-1">{partner.address[lang]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="font-bold text-[9px]">{partner.phone}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-teal-600 border-t border-teal-100/50 pt-3">
                    <span className="text-[8px] font-black uppercase tracking-widest">იხილეთ მეტი</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                ობიექტები ვერ მოიძებნა
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Partners;