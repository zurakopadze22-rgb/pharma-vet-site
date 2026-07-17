import React from 'react';
import { Target, ShieldCheck } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const AboutUs = ({ t, lang }) => {
  const seoInfo = {
    GE: {
      title: "ჩვენ შესახებ - ისტორია და მისია | Pharma Vet",
      description: "Pharma Vet - ევროპული ვეტერინარული პრეპარატების ლიდერი იმპორტიორი და დისტრიბუტორი საქართველოში. გაიგეთ მეტი ჩვენი მისიისა და ხარისხის გარანტიის შესახებ.",
      keywords: "ფარმავეტი ისტორია, ვეტერინარია საქართველო, ევროპული ვეტერინარული პრეპარატები"
    },
    EN: {
      title: "About Us - History and Mission | Pharma Vet",
      description: "Pharma Vet - Leading importer and distributor of European veterinary pharmaceuticals in Georgia. Learn more about our mission and quality assurance.",
      keywords: "pharmavet history, veterinary medicine georgia, european veterinary medicine"
    },
    RU: {
      title: "О нас - История и миссия | Pharma Vet",
      description: "Pharma Vet - Ведущий импортер и дистрибьютор европейских ветеринарных препаратов в Грузии. Узнайте больше о нашей миссии и гарантии качества.",
      keywords: "история фармавет, ветеринария в грузии, европейские ветеринарные препараты"
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
        "name": lang === 'GE' ? 'ჩვენ შესახებ' : lang === 'EN' ? 'About Us' : 'О нас',
        "item": "https://www.pharmavet.ge/about"
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
  return (
    <div className="animate-in fade-in duration-1000">
      {/* ჰერო სექცია სურათით - შენარჩუნებული ვიზუალი */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070" 
          alt="About Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950">
            {t.title}
          </h1>
          <div className="h-2 w-24 bg-teal-600 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* ძირითადი ტექსტი - შენარჩუნებული Grid სისტემა */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-black mb-8 leading-tight text-slate-950">
            {t.heading}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
            {t.desc1}
          </p>
          <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
            {t.desc2}
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-100">
            <div>
              <span className="block text-4xl font-black text-teal-600 mb-2">10+</span>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {t.exp}
              </span>
            </div>
            <div>
              <span className="block text-4xl font-black text-teal-600 mb-2">500+</span>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {t.clinics}
              </span>
            </div>
          </div>
        </div>

        {/* მარჯვენა ბლოკი - შენარჩუნებული rounded-[4rem] და shadow */}
        <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 shadow-inner grid grid-cols-1 gap-10">
          <div className="flex gap-6">
            <Target className="w-10 h-10 text-teal-600 shrink-0" />
            <div>
              <h4 className="font-black text-xl mb-2 text-slate-950">{t.mission}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t.mission_text}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <ShieldCheck className="w-10 h-10 text-teal-600 shrink-0" />
            <div>
              <h4 className="font-black text-xl mb-2 text-slate-950">{t.quality}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t.quality_text}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;