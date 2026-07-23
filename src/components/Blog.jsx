import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, ArrowRight, Video } from 'lucide-react';
import { getStoredArticles } from '../utils/blogStore';
import { useSEO } from '../hooks/useSEO';

const Blog = ({ lang, t, onArticleClick }) => {
  const [articles, setArticles] = useState(getStoredArticles());

  useEffect(() => {
    const handleUpdate = () => {
      setArticles(getStoredArticles());
    };
    window.addEventListener('pharmavet_blogs_updated', handleUpdate);
    return () => window.removeEventListener('pharmavet_blogs_updated', handleUpdate);
  }, []);

  const seoInfo = {
    GE: {
      title: "ვეტერინარული ბლოგი - რჩევები და სტატიები | Pharma Vet",
      description: "წაიკითხეთ პროფესიონალური სტატიები ცხოველთა მოვლის, დაავადებების პრევენციის, კვებისა და ჯანმრთელობის შესახებ Pharma Vet-ის ექსპერტებისგან.",
      keywords: "ვეტერინარული ბლოგი, რჩევები ცხოველებზე, ძაღლის მოვლა, კატის დაავადებები, საქონლის მასტიტი"
    },
    EN: {
      title: "Veterinary Blog - Advices & Articles | Pharma Vet",
      description: "Read professional articles on animal care, disease prevention, nutrition, and health from Pharma Vet experts.",
      keywords: "veterinary blog, animal care tips, dog care, cat diseases, dairy cattle mastitis"
    },
    RU: {
      title: "Ветеринарный блог - Советы и статьи | Pharma Vet",
      description: "Читайте профессиональные статьи об уходе за животными, профилактике заболеваний, питании и здоровье от экспертов Pharma Vet.",
      keywords: "ветеринарный блог, советы по уходу за животными, уход за собаками, болезни кошек, мастит КРС"
    }
  };

  const currentSEO = seoInfo[lang] || seoInfo.GE;

  const schema = {
    "@context": "https://schema.org",
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
      }
    ]
  };

  useSEO({
    title: currentSEO.title,
    description: currentSEO.description,
    keywords: currentSEO.keywords,
    schema,
    lang
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");

  // --- კატეგორიების თარგმანი ---
  const categoryTranslations = {
    health: { GE: "ჯანმრთელობა", EN: "Health", RU: "Здоровье" },
    nutrition: { GE: "კვება", EN: "Nutrition", RU: "Питание" },
    prevention: { GE: "პრევენცია", EN: "Prevention", RU: "Профилактика" },
    tips: { GE: "რჩევები", EN: "Tips", RU: "Советы" },
    care: { GE: "მოვლა", EN: "Care", RU: "Уход" }
  };

  const speciesFilters = [
    { id: 'all', label: lang === 'GE' ? 'ყველა' : lang === 'EN' ? 'All' : 'Все', icon: '🐾' },
    { id: 'dog', label: lang === 'GE' ? 'ძაღლი' : lang === 'EN' ? 'Dog' : 'Собака', icon: '🐕' },
    { id: 'cat', label: lang === 'GE' ? 'კატა' : lang === 'EN' ? 'Cat' : 'Кошка', icon: '🐈' },
    { id: 'livestock', label: lang === 'GE' ? 'ფერმა' : lang === 'EN' ? 'Farm' : 'Ферма', icon: '🐄' },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = article.title?.[lang] || article.title?.GE || "";
      const excerpt = article.excerpt?.[lang] || article.excerpt?.GE || "";
      
      const categoryText = categoryTranslations[article.category]?.[lang] || article.category || "";
      
      const matchesSearch = 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryText.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = selectedSpecies === "all" || article.species === selectedSpecies;
      return matchesSearch && matchesSpecies;
    });
  }, [articles, searchQuery, selectedSpecies, lang]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            {lang === 'GE' ? 'რჩევები და ბლოგი' : lang === 'EN' ? 'Tips & Blog' : 'Советы и Блог'}
          </h1>
          <p className="text-slate-500 font-bold text-sm">
            {lang === 'GE' ? 'პროფესიონალური რჩევები თქვენი ცხოველების ჯანმრთელობისთვის' : lang === 'EN' ? 'Professional advice for your pet\'s health' : 'Профессиональные советы'}
          </p>
        </div>

        {/* საძიებო ველის ბლოკი */}
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder={lang === 'GE' ? "ძებნა ბლოგში..." : lang === 'EN' ? "Search blog..." : "Поиск в блоге..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-teal-500 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold transition-all outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ფილტრების ბარი */}
      <div className="flex flex-wrap gap-2 mb-12">
        {speciesFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedSpecies(filter.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              selectedSpecies === filter.id 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* სტატიების ბადე */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => {
          const isVideoMedia = article.isVideo || article.mediaType === 'video' || (article.video && article.video.length > 0) || (typeof article.image === 'string' && (article.image.endsWith('.mp4') || article.image.endsWith('.webm') || article.image.startsWith('data:video')));

          return (
            <article 
              key={article.id || article.slug}
              onClick={() => onArticleClick(article)}
              className="group bg-white rounded-[2.5rem] border-2 border-slate-50 overflow-hidden hover:shadow-2xl hover:border-teal-100 transition-all duration-500 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                {isVideoMedia ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                    <video 
                      src={article.video || article.image} 
                      className="w-full h-full object-cover opacity-80" 
                      muted 
                      playsInline
                    />
                    <div className="absolute w-12 h-12 rounded-full bg-teal-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Video className="w-6 h-6" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={article.image || '/images/1.webp'} 
                    alt={article.title?.[lang] || article.title?.GE || ''}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                )}

                {/* მრავალენოვანი ბეიჯი სურათზე */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-teal-600 border border-teal-100">
                  {categoryTranslations[article.category]?.[lang] || article.category}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase mb-4">
                  <Calendar className="w-3 h-3" />
                  {article.date}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-teal-600 transition-colors uppercase tracking-tighter">
                  {article.title?.[lang] || article.title?.GE}
                </h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt?.[lang] || article.excerpt?.GE}
                </p>
                <button className="mt-auto flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest group/btn">
                  {lang === 'GE' ? 'სრულად ნახვა' : lang === 'EN' ? 'Read More' : 'Читать далее'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;