import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const Hero = ({ t, lang, setView }) => {
  const seoInfo = {
    GE: {
      title: "Pharma Vet • ვეტერინარული პრეპარატები, წამლები & ბლოგი",
      description: "Pharma Vet Georgia - ვეტერინარული პრეპარატების იმპორტი, დისტრიბუცია, პერორალური ხსნარი და პროფესიონალური რჩევები ცხოველთა მოვლაზე.",
      keywords: "ვეტერინარული პრეპარატები, ცხოველების წამლები, რჩევები ცხოველებზე, ვეტერინარული ბლოგი, ძაღლის კვება, კატის ვიტამინები, ხსნარი, პერორალური, ვეტერინარია საქართველო, ფარმავეტი, ფუტკრის მოვლა, მეცხოველეობა, pharmavet.ge"
    },
    EN: {
      title: "Pharma Vet • Veterinary Medicine & Blog",
      description: "Pharma Vet Georgia - Import and distribution of high-quality veterinary pharmaceuticals, oral solutions, and professional animal health advice.",
      keywords: "veterinary medicine, veterinary blog, animal care tips, animal health, pet nutrition, animal care, animal treatment, veterinary drugs, pharmavet"
    },
    RU: {
      title: "Pharma Vet • Ветеринарные препараты и блог",
      description: "Pharma Vet Georgia - Импорт и дистрибуция ветеринарных препаратов, оральные растворы и профессиональные советы по уходу за животными.",
      keywords: "ветеринарные препараты, лекарства для животных, ветеринарный блог, ветеринария, витамины для собак, уход за животными, фармавет"
    }
  };

  const currentSEO = seoInfo[lang] || seoInfo.GE;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.pharmavet.ge/#website",
        "url": "https://www.pharmavet.ge/",
        "name": "Pharma Vet",
        "description": "Professional veterinary pharmaceuticals distribution and educational blog for animal health and care.",
        "publisher": {
          "@id": "https://www.pharmavet.ge/#organization"
        },
        "inLanguage": lang === 'GE' ? 'ka' : lang.toLowerCase()
      },
      {
        "@type": "Organization",
        "@id": "https://www.pharmavet.ge/#organization",
        "name": "Pharma Vet",
        "alternateName": ["ფარმავეტი", "Фарма Вет", "Pharmavet.ge"],
        "url": "https://www.pharmavet.ge/",
        "logo": "https://www.pharmavet.ge/logo.webp",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "areaServed": "GE",
          "availableLanguage": ["Georgian", "English", "Russian"]
        },
        "sameAs": [
          "https://www.facebook.com/pharmavet.ge"
        ]
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2000",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full max-w-[92%] mx-auto pt-4 md:pt-6 pb-2">
      <header className="relative h-[280px] sm:h-[320px] md:h-[380px] w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-[3px] sm:border-[5px] border-teal-500 shadow-lg bg-slate-900">
        
        {/* სლაიდერი */}
        {slides.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          >
            <img 
              src={img} 
              alt={`Pharma Vet ვეტერინარული პრეპარატები და მოვლა - სლაიდი ${index + 1}`} 
              className="w-full h-full object-cover" 
              width="1200"
              height="380"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}

        {/* მუქი გრადიენტი */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/30 to-transparent z-10"></div>

        <div className="relative z-20 h-full flex items-center px-8 sm:px-16 md:px-24">
          <div className="max-w-xl">
            {/* სათაური */}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 leading-[1.1] tracking-tighter uppercase">
              {t.title.split(' ')[0]}{" "}
              <span className="text-teal-400">
                {t.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            
            {/* აღწერა */}
            <p className="text-slate-200 text-[11px] sm:text-[13px] md:text-base mb-5 sm:mb-6 max-w-md font-medium leading-relaxed border-l-[3px] border-teal-500 pl-4 opacity-80 italic">
              {t.desc}
            </p>

            {/* ღილაკი */}
            <button
              onClick={() => setView('products')}
              className="group bg-teal-500 text-white px-6 py-2 sm:py-2.5 rounded-lg font-black text-[8px] sm:text-[9px] uppercase tracking-[0.25em] hover:bg-white hover:text-slate-950 transition-all flex items-center gap-2 active:scale-95 shadow-md"
            >
              {t.button} <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            </button>
          </div>

          {/* ჰორიზონტალური ინდიკატორები */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-500 rounded-full outline-none h-1 ${
                  idx === currentSlide 
                    ? 'w-8 bg-teal-400' 
                    : 'w-3 bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Hero;