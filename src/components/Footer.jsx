import React from 'react';

const Footer = ({ t }) => {
  return (
    <footer className="bg-white border-t border-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <img src="/logo.png" className="h-20 mx-auto mb-8" alt="Logo" />
        <p className="text-slate-400 font-bold mb-10 max-w-xl mx-auto">{t.text}</p>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{t.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;