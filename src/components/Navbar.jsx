import React from 'react';
import { Menu, Globe, X, Handshake } from 'lucide-react';

const Navbar = ({ setView, view, lang, setLang, t, setIsMenuOpen, isMenuOpen }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('home')}>
            <img src="/logo.png" alt="Logo" className="h-14 md:h-16 object-contain" />
            <div className="hidden lg:flex flex-col border-l-2 border-slate-100 pl-6 text-sm">
              {/* აქ გასწორდა: t.navbar.slogan1 შეიცვალა t.slogan1-ით */}
              <span className="font-black text-slate-950 uppercase tracking-tighter">{t.slogan1}</span>
              <span className="font-black text-teal-600 uppercase tracking-tighter">{t.slogan2}</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => setView('products')} className={`text-sm font-black uppercase tracking-widest ${view === 'products' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.products}
            </button>
            <button onClick={() => setView('partners')} className={`text-sm font-black uppercase tracking-widest ${view === 'partners' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.partners}
            </button>
            <button onClick={() => setView('about')} className={`text-sm font-black uppercase tracking-widest ${view === 'about' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.about}
            </button>
            
            {/* გახდი პარტნიორი ღილაკი */}
            <button 
              onClick={() => setView('become-partner')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${view === 'become-partner' ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white'}`}
            >
              <Handshake className="w-4 h-4" />
              {lang === 'GE' ? 'გახდი პარტნიორი' : lang === 'EN' ? 'Become a Partner' : 'Стать партнером'}
            </button>
            
            <div className="flex items-center gap-3 border-l pl-6">
              <Globe className="w-4 h-4 text-slate-400" />
              {['GE', 'EN', 'RU'].map((l) => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[11px] font-black transition-colors ${lang === l ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;