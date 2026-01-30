import React, { useState, useMemo } from 'react';
import { Search, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { blogArticles } from '../data/blogData';

const Blog = ({ lang, t, onArticleClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");

  const speciesFilters = [
    { id: 'all', label: lang === 'GE' ? 'ყველა' : 'All', icon: '🐾' },
    { id: 'dog', label: lang === 'GE' ? 'ძაღლი' : 'Dog', icon: '🐕' },
    { id: 'cat', label: lang === 'GE' ? 'კატა' : 'Cat', icon: '🐈' },
    { id: 'livestock', label: lang === 'GE' ? 'ფერმა' : 'Farm', icon: '🐄' },
  ];

  const filteredArticles = useMemo(() => {
    return blogArticles.filter(article => {
      const title = article.title[lang] || "";
      const excerpt = article.excerpt[lang] || "";
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecies = selectedSpecies === "all" || article.species === selectedSpecies;
      return matchesSearch && matchesSpecies;
    });
  }, [searchQuery, selectedSpecies, lang]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            {lang === 'GE' ? 'რჩევები და ბლოგი' : 'Tips & Blog'}
          </h1>
          <p className="text-slate-500 font-bold text-sm">
            {lang === 'GE' ? 'პროფესიონალური რჩევები თქვენი ცხოველების ჯანმრთელობისთვის' : 'Professional advice for your pet\'s health'}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder={lang === 'GE' ? "ძებნა სტატიებში..." : "Search articles..."}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-bold text-sm shadow-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {speciesFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedSpecies(filter.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
              selectedSpecies === filter.id 
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
              : 'bg-white text-slate-400 border-2 border-slate-50 hover:border-teal-100'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <article 
            key={article.id}
            onClick={() => onArticleClick(article)} // <-- აი, აქ ხდება სტატიის გახსნა
            className="group bg-white rounded-[2.5rem] border-2 border-slate-50 overflow-hidden hover:shadow-2xl hover:border-teal-100 transition-all duration-500 flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title[lang]}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-teal-600">
                {article.category}
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase mb-4">
                <Calendar className="w-3 h-3" />
                {article.date}
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-teal-600 transition-colors">
                {article.title[lang]}
              </h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 line-clamp-3">
                {article.excerpt[lang]}
              </p>
              <button className="mt-auto flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest group/btn">
                {lang === 'GE' ? 'სრულად ნახვა' : 'Read More'}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            {lang === 'GE' ? 'სტატიები ვერ მოიძებნა' : 'No articles found'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;