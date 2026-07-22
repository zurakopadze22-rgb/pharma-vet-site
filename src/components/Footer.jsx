import React from 'react';

const Footer = ({ t }) => {
  return (
    <footer className="bg-white border-t border-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <img 
          src="/logo.webp" 
          className="h-20 w-20 mx-auto mb-8 bg-white p-2 rounded-2xl object-contain aspect-square" 
          alt="Pharma Vet Georgia - ვეტერინარული დისტრიბუცია და პორტალი" 
          width="80"
          height="80"
          loading="lazy"
        />
        <p className="text-slate-400 font-bold mb-10 max-w-xl mx-auto">{t.text}</p>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{t.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;