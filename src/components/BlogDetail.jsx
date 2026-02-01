import React, { useState } from 'react';
import { ArrowLeft, Calendar, Facebook, MessageCircle, Copy, Check, Tag, CheckCircle2, Lightbulb } from 'lucide-react';

const BlogDetail = ({ article, lang, t, onBack }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const shareUrl = window.location.href;
  const shareTitle = article.title[lang];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    messenger: `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-6 md:py-16 animate-in fade-in duration-1000">
      
      {/* ფონის დეკორი */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-50/40 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>

      {/* ნავიგაცია */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[10px] uppercase mb-8 md:mb-12 transition-all tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        {lang === 'GE' ? 'უკან ბლოგზე' : 'Back to Blog'}
      </button>

      {/* მთავარი სექცია - მობილურზე სურათი ზემოთაა, ტექსტი ქვემოთ */}
      <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">
        
        {/* სურათის ბლოკი - მობილურზე სტატიკურია, კომპიუტერზე სტიქი */}
        <div className="w-full lg:sticky lg:top-28">
          <div className="relative rounded-[2rem] rounded-bl-none overflow-hidden shadow-xl shadow-teal-100/20 transform lg:-rotate-1">
            <img 
              src={article.image} 
              alt={article.title[lang]} 
              className="w-full h-[200px] md:h-[400px] object-cover" 
            />
          </div>
          
          {article.quickTip && (
            <div className="mt-4 md:mt-6 bg-teal-50 rounded-2xl md:rounded-3xl p-5 border-l-4 border-teal-500 shadow-sm">
               <div className="flex items-center gap-2 text-teal-700 font-black text-[9px] uppercase mb-1">
                 <Lightbulb className="w-3.5 h-3.5" />
                 {lang === 'GE' ? 'რჩევა' : 'Tip'}
               </div>
               <p className="text-teal-900/70 text-[11px] md:text-xs font-bold leading-relaxed italic">
                 {article.quickTip[lang]}
               </p>
            </div>
          )}
        </div>

        {/* კონტენტი */}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase ml-auto">
              <Calendar className="w-3 h-3 text-teal-500" />
              {article.date}
            </div>
          </div>

          <h1 className="text-2xl md:text-5xl font-black text-teal-600 mb-6 md:mb-8 leading-[1.1] tracking-tighter uppercase">
            {article.title[lang]}
          </h1>

          <div className="text-slate-600 space-y-6 md:space-y-8">
            <p className="text-lg md:text-2xl leading-relaxed font-bold text-slate-800 border-b border-teal-50 pb-6 md:pb-8 italic">
              {article.excerpt[lang]}
            </p>

            <div className="text-base md:text-lg leading-loose font-medium text-slate-600 whitespace-pre-line">
              {article.content[lang]}
            </div>

            {/* დასკვნები */}
            {article.takeaways && article.takeaways[lang] && (
              <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 mt-8 md:mt-12 shadow-xl shadow-slate-200">
                <h4 className="text-base md:text-lg font-black text-teal-400 uppercase mb-4 md:mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  {lang === 'GE' ? 'მთავარი რეკომენდაციები' : 'Key Takeaways'}
                </h4>
                <ul className="grid gap-3 md:gap-4">
                  {article.takeaways[lang].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 font-bold text-xs md:text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* გაზიარება */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-slate-100">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4 md:mb-6">
               {lang === 'GE' ? 'გაუზიარეთ მეგობრებს' : 'Share with friends'}
             </span>
             
             <div className="flex flex-wrap gap-2 md:gap-3">
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1877F2] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  FB
                </a>

                <a 
                  href={shareLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  WA
                </a>

                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${
                    copied ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? (lang === 'GE' ? 'OK' : 'Copied') : (lang === 'GE' ? 'LINK' : 'Link')}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;