// src/components/PartnerDetail.jsx
import React from 'react';
import { ArrowLeft, MapPin, Phone, ExternalLink, Clock } from 'lucide-react';

const PartnerDetail = ({ partner, lang, onBack, t }) => {
  if (!partner) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* უკან დაბრუნების ღილაკი */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[10px] uppercase mb-10 transition-all group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {lang === 'GE' ? 'უკან დაბრუნება' : 'Back to Partners'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* სურათის ბლოკი სქელი კანტით */}
        <div className="relative border-[6px] border-teal-100 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <img src={partner.image} className="w-full aspect-square object-cover" alt="" />
          <div className="absolute top-6 right-6 bg-teal-500 text-white px-4 py-1.5 rounded-2xl font-black text-[10px] uppercase shadow-lg">
            {partner.workHours}
          </div>
        </div>

        {/* ინფორმაციის ბლოკი */}
        <div className="flex flex-col h-full justify-center">
          <div className="mb-8">
            <span className="text-teal-600 font-black text-[11px] uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-6 inline-block">
              {lang === 'GE' ? 'პარტნიორი ობიექტი' : 'Partner Store'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              {partner.name[lang]}
            </h1>
          </div>

          <div className="space-y-4 mb-10">
            {/* მისამართი */}
            <div className="bg-slate-50 p-5 rounded-[2rem] border-2 border-teal-100/50 flex items-center gap-5 hover:border-teal-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">მისამართი</p>
                <p className="font-black text-slate-900 text-lg leading-tight">{partner.address[lang]}</p>
              </div>
            </div>

            {/* ტელეფონი */}
            <div className="bg-slate-50 p-5 rounded-[2rem] border-2 border-teal-100/50 flex items-center gap-5 hover:border-teal-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ტელეფონი</p>
                <p className="font-black text-slate-900 text-lg leading-tight">{partner.phone}</p>
              </div>
            </div>
          </div>

          {/* Google Maps ღილაკი - იღებს ლინკს partners.js-დან */}
          <a 
            href={partner.mapLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full bg-slate-950 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-teal-600 transition-all shadow-2xl shadow-teal-900/20 active:scale-95"
          >
            {lang === 'GE' ? 'იხილეთ რუკაზე' : 'View on Google Maps'} <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetail;