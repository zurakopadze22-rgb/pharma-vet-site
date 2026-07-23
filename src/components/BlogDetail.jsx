import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Facebook, MessageCircle, Copy, Check, CheckCircle2, Lightbulb, Share2, Video } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getStoredArticles } from '../utils/blogStore';
import { productsData } from '../data/products';
import { useSEO } from '../hooks/useSEO';
import { useToast } from '../context/ToastContext';

const BlogDetail = ({ lang, t, onBack }) => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const [articles, setArticles] = useState(getStoredArticles());

  useEffect(() => {
    const handleUpdate = () => setArticles(getStoredArticles());
    window.addEventListener('pharmavet_blogs_updated', handleUpdate);
    return () => window.removeEventListener('pharmavet_blogs_updated', handleUpdate);
  }, []);

  const article = articles.find(a => a.slug === slug);
  const isArticleAvailable = !!article;

  const articleTitle = isArticleAvailable ? (article.title[lang] || article.title.GE || '') : '';
  const articleExcerpt = isArticleAvailable ? (article.excerpt[lang] || article.excerpt.GE || '') : '';
  const articleImage = isArticleAvailable 
    ? (article.image && article.image.startsWith('http') ? article.image : (article.image ? `https://www.pharmavet.ge${article.image}` : ''))
    : '';
  const articleUrl = isArticleAvailable ? `https://www.pharmavet.ge/blog/${article.slug}` : '';

  const schema = isArticleAvailable ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "headline": articleTitle,
        "image": articleImage,
        "datePublished": article.date,
        "description": articleExcerpt,
        "url": articleUrl,
        "author": {
          "@type": "Organization",
          "name": "Pharma Vet"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pharma Vet",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.pharmavet.ge/logo.webp"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": lang === 'GE' ? 'მთავარი' : lang === 'EN' ? 'Home' : 'Главная',
            "item": "https://www.pharmavet.ge/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": lang === 'GE' ? 'ბლოგი' : lang === 'EN' ? 'Blog' : 'Блог',
            "item": "https://www.pharmavet.ge/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": articleTitle,
            "item": articleUrl
          }
        ]
      }
    ]
  } : null;

  useSEO({
    title: isArticleAvailable ? `${articleTitle} | Pharma Vet` : 'ბლოგი | Pharma Vet',
    description: articleExcerpt,
    keywords: isArticleAvailable ? `${articleTitle}, ვეტერინარული ბლოგი, რჩევები ცხოველებზე` : '',
    ogTitle: articleTitle,
    ogDescription: articleExcerpt,
    ogImage: articleImage,
    schema,
    lang
  });

  if (!article) {
    return (
      <div className="text-center py-20">
        <p>სტატია ვერ მოიძებნა</p>
        <button onClick={onBack}>უკან დაბრუნება</button>
      </div>
    );
  }

  const categoryTranslations = {
    health: { GE: "ჯანმრთელობა", EN: "Health", RU: "Здоровье" },
    nutrition: { GE: "კვება", EN: "Nutrition", RU: "Питание" },
    prevention: { GE: "პრევენცია", EN: "Prevention", RU: "Профилактика" },
    tips: { GE: "რჩევები", EN: "Tips", RU: "Советы" },
    care: { GE: "მოვლა", EN: "Care", RU: "Уход" }
  };

  const categoryLabel = categoryTranslations[article.category]?.[lang] || article.category;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${article.slug}` 
    : '';
  const shareTitle = article.title[lang];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
    viber: `viber://forward?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast(lang === 'GE' ? 'სტატიის ბმული დაკოპირდა!' : 'Article link copied!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const getLabel = (key) => {
    const labels = {
      back: { GE: 'უკან ბლოგზე', EN: 'Back to Blog', RU: 'Назад в блог' },
      tip: { GE: 'რჩევა', EN: 'Tip', RU: 'Совет' },
      takeaways: { GE: 'მთავარი რეკომენდაციები', EN: 'Key Takeaways', RU: 'Основные выводы' },
      share: { GE: 'გაუზიარეთ მეგობრებს', EN: 'Share with friends', RU: 'Поделиться' }
    };
    return labels[key][lang] || labels[key]['EN'];
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
        {getLabel('back')}
      </button>

      <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">
        
        {/* სურათის ბლოკი */}
        <div className="w-full lg:sticky lg:top-28">
          <div className="relative rounded-[2rem] rounded-bl-none overflow-hidden shadow-xl shadow-teal-100/20 transform lg:-rotate-1 bg-slate-900">
            {(article.isVideo || article.mediaType === 'video' || (article.video && article.video.length > 0) || (typeof article.image === 'string' && (article.image.endsWith('.mp4') || article.image.endsWith('.webm') || article.image.startsWith('data:video')))) ? (
              <video 
                src={article.video || article.image} 
                controls 
                autoPlay 
                muted 
                className="w-full h-[220px] md:h-[400px] object-cover" 
              />
            ) : (
              <img 
                src={article.image} 
                alt={article.title?.[lang] || article.title?.GE || ''} 
                className="w-full h-[200px] md:h-[400px] object-cover" 
              />
            )}
          </div>
          
          {article.quickTip && (
            <div className="mt-4 md:mt-6 bg-teal-50 rounded-2xl md:rounded-3xl p-5 border-l-4 border-teal-500 shadow-sm">
               <div className="flex items-center gap-2 text-teal-700 font-black text-[9px] uppercase mb-1">
                 <Lightbulb className="w-3.5 h-3.5" />
                 {getLabel('tip')}
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
              {categoryLabel}
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
                  {getLabel('takeaways')}
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

            {/* 💊 რეკომენდებული ვეტერინარული პრეპარატები */}
            {article.recommendedProducts && article.recommendedProducts.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-teal-50/60 rounded-[2.5rem] border-2 border-teal-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-black text-teal-950 uppercase mb-6 tracking-tight flex items-center gap-2">
                  💊 {lang === 'GE' ? 'რეკომენდებული ვეტერინარული პრეპარატები' : lang === 'EN' ? 'Recommended Veterinary Medicines' : 'Рекомендуемые препараты'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.recommendedProducts.map(productSlug => {
                    const matchedProd = productsData.find(p => p.slug === productSlug);
                    if (!matchedProd) return null;
                    return (
                      <a
                        key={matchedProd.id}
                        href={`/product/${matchedProd.slug}`}
                        className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all group"
                      >
                        <img 
                          src={matchedProd.image} 
                          alt={matchedProd.name[lang]} 
                          className="w-16 h-16 object-contain rounded-xl p-1 bg-teal-50/50 group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-0.5">{matchedProd.manufacturer}</p>
                          <h4 className="text-xs font-black text-slate-900 truncate uppercase">{matchedProd.name[lang]}</h4>
                          <p className="text-xs font-black text-teal-700 mt-1">{matchedProd.price.toFixed(1)} ₾</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* გაზიარება */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-slate-100">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4 md:mb-6">
               {getLabel('share')}
             </span>
             
             <div className="flex flex-wrap gap-2 md:gap-3">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                  <Facebook className="w-3.5 h-3.5 fill-current" /> FB
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" /> WA
                </a>
                <a href={shareLinks.viber} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#7360F2] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                  <Share2 className="w-3.5 h-3.5" /> Viber
                </a>
                <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${copied ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'OK' : 'LINK'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;