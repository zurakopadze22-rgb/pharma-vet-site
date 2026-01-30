import React from 'react';
import { Menu, Globe, X, Handshake } from 'lucide-react';

const Navbar = ({ setView, view, lang, setLang, t, setIsMenuOpen, isMenuOpen }) => {
  
  const handleNavClick = (targetView) => {
    setView(targetView);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section - აქ შევცვალეთ კლასები */}
          <div className="flex items-center gap-3 md:gap-6 cursor-pointer group" onClick={() => handleNavClick('home')}>
            <img src="/logo.png" alt="Logo" className="h-10 md:h-16 object-contain" />
            
            {/* ლოზუნგი: ახლა ჩანს მობილურზეც (flex), ოღონდ უფრო პატარა ტექსტით (text-[9px]) */}
            <div className="flex flex-col border-l border-slate-200 pl-3 md:pl-6 text-[9px] md:text-sm">
              <span className="font-black text-slate-950 uppercase tracking-tighter leading-none">
                {t.slogan1 || "უკეთესი ხარისხი"}
              </span>
              <span className="font-black text-teal-600 uppercase tracking-tighter leading-none mt-0.5">
                {t.slogan2 || "უკეთეს ფასად"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => setView('products')} className={`text-[11px] font-black uppercase tracking-widest ${view === 'products' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.products}
            </button>
            <button onClick={() => setView('partners')} className={`text-[11px] font-black uppercase tracking-widest ${view === 'partners' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.partners}
            </button>
            <button onClick={() => setView('about')} className={`text-[11px] font-black uppercase tracking-widest ${view === 'about' ? 'text-teal-600' : 'text-slate-950 hover:text-teal-600'}`}>
              {t.about}
            </button>
            
            <button 
              onClick={() => setView('become-partner')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 bg-white border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white"
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-950"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
        <div className="px-6 py-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <button onClick={() => handleNavClick('products')} className="text-left font-black uppercase tracking-widest text-sm text-slate-950">{t.products}</button>
            <button onClick={() => handleNavClick('partners')} className="text-left font-black uppercase tracking-widest text-sm text-slate-950">{t.partners}</button>
            <button onClick={() => handleNavClick('about')} className="text-left font-black uppercase tracking-widest text-sm text-slate-950">{t.about}</button>
          </div>
          
          <button 
            onClick={() => handleNavClick('become-partner')}
            className="w-full flex items-center justify-center gap-3 bg-teal-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
          >
            <Handshake className="w-5 h-5" />
            {lang === 'GE' ? 'გახდი პარტნიორი' : lang === 'EN' ? 'Become a Partner' : 'Стать партнером'}
          </button>

          <div className="flex justify-center gap-8">
            {['GE', 'EN', 'RU'].map((l) => (
              <button 
                key={l}
                onClick={() => { setLang(l); setIsMenuOpen(false); }}
                className={`text-sm font-black ${lang === l ? 'text-teal-600' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;