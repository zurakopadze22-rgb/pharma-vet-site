import React, { useState } from 'react';
import { ArrowLeft, Calendar, Facebook, MessageCircle, Copy, Check, Tag, CheckCircle2, Lightbulb } from 'lucide-react';

const BlogDetail = ({ article, lang, t, onBack }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const shareUrl = window.location.href;
  const shareTitle = article.title[lang];

  // სოციალური ქსელების ბმულები
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
    <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-1000">
      
      {/* ფონის დეკორი */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-50/40 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>

      {/* ნავიგაცია */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[10px] uppercase mb-12 transition-all tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        {lang === 'GE' ? 'უკან ბლოგზე' : 'Back to Blog'}
      </button>

      <div className="grid lg:grid-cols-[350px_1fr] gap-12 mb-16 items-start">
        
        {/* მარცხენა მხარე: სურათი და რჩევა */}
        <div className="sticky top-28">
          <div className="relative rounded-[2.5rem] rounded-bl-none overflow-hidden shadow-2xl shadow-teal-100/30 transform -rotate-1">
            <img 
              src={article.image} 
              alt={article.title[lang]} 
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
          
          {article.quickTip && (
            <div className="mt-6 bg-teal-50 rounded-3xl p-6 border-l-4 border-teal-500 shadow-sm">
               <div className="flex items-center gap-2 text-teal-700 font-black text-[10px] uppercase mb-2">
                 <Lightbulb className="w-4 h-4" />
                 {lang === 'GE' ? 'სწრაფი რჩევა' : 'Quick Tip'}
               </div>
               <p className="text-teal-900/70 text-xs font-bold leading-relaxed italic">
                 {article.quickTip[lang]}
               </p>
            </div>
          )}
        </div>

        {/* მარჯვენა მხარე: კონტენტი */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase ml-auto">
              <Calendar className="w-3.5 h-3.5 text-teal-500" />
              {article.date}
            </div>
          </div>

          {/* სათაური მომწვანო ფერში */}
          <h1 className="text-3xl md:text-5xl font-black text-teal-600 mb-8 leading-[1.1] tracking-tighter uppercase">
            {article.title[lang]}
          </h1>

          <div className="text-slate-600 space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed font-bold text-slate-800 border-b border-teal-50 pb-8 italic">
              {article.excerpt[lang]}
            </p>

            <div className="text-lg leading-loose font-medium text-slate-600 whitespace-pre-line">
              {article.content[lang]}
            </div>

            {/* დასკვნები მოდის DATA-დან */}
            {article.takeaways && article.takeaways[lang] && (
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 mt-12 shadow-xl shadow-slate-200">
                <h4 className="text-lg font-black text-teal-400 uppercase mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  {lang === 'GE' ? 'მთავარი რეკომენდაციები' : 'Key Takeaways'}
                </h4>
                <ul className="grid gap-4">
                  {article.takeaways[lang].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 font-bold text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* გაზიარების სექცია */}
          <div className="mt-16 pt-8 border-t border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">
               {lang === 'GE' ? 'გაუზიარეთ სტატია' : 'Share this article'}
             </span>
             
             <div className="flex flex-wrap gap-3">
                {/* Facebook */}
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#1877F2] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                  Facebook
                </a>

                {/* WhatsApp */}
                <a 
                  href={shareLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp
                </a>

                {/* Copy Link */}
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                    copied ? 'bg-teal-500 text-white shadow-teal-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? (lang === 'GE' ? 'დაკოპირდა' : 'Copied') : (lang === 'GE' ? 'ბმულის კოპირება' : 'Copy Link')}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;