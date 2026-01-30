import React from 'react';
import { CheckCircle2, ArrowRight, Building2, ShieldCheck, Zap, Phone, TrendingDown, PlayCircle } from 'lucide-react';

const BecomePartner = ({ lang }) => {
  const content = {
    GE: {
      title: "გახდი ჩვენი პარტნიორი",
      subtitle: "კომპანია ფარმავეტი რეგიონების კერძო ვეტ-აფთიაქებს სთავაზობს ფრინველის 1 ლიტრიან პრეპარატებზე თანამშრომლობას ჩვენს საცალო ფასებში, რაც გულისხმობს ნებისმიერი სხვა კომპანიის საცალო ფასებზე კონკურენტულ პირობებს.",
      videoPlaceholder: "ვიდეო ინსტრუქცია მალე დაემატება",
      steps: [
        { title: "კონსულტაცია", desc: "დაგვიკავშირდით ნომერზე და მიიღეთ დეტალური ინფორმაცია საფასო პოლიტიკაზე." },
        { title: "შეთავაზება", desc: "ჩვენ მოვარგებთ პირობებს თქვენი აფთიაქის ლოკაციასა და მოთხოვნებს." },
        { title: "მიწოდება", desc: "მოგაწვდით პროდუქციას უმოკლეს ვადაში, ყველაზე კონკურენტულ ფასად." }
      ],
      benefitsTitle: "რატომ Pharma Vet?",
      benefits: ["ყველაზე დაბალი საცალო ფასი ბაზარზე", "ფოკუსი 1-ლიტრიან პრეპარატებზე", "სწრაფი მიწოდება რეგიონებში", "ევროპული ხარისხის გარანტია"],
      ctaTitle: "მზად ხართ დასაწყებად?",
      ctaDesc: "დაგვიკავშირდით ნომერზე დეტალური პირობების მისაღებად:",
      ctaBtn: "დარეკვა",
      phone: "+995 599 00 00 00"
    },
    EN: {
      title: "Become Our Partner",
      subtitle: "Pharma Vet offers regional private vet pharmacies a partnership on our 1L poultry products line with retail prices that are more competitive than any other company's retail rates.",
      videoPlaceholder: "Video tutorial coming soon",
      steps: [
        { title: "Consultation", desc: "Contact us by phone to get detailed information on our pricing policy." },
        { title: "Proposal", desc: "We tailor the terms to your pharmacy's location and specific needs." },
        { title: "Delivery", desc: "Fastest delivery to regions at the most competitive prices." }
      ],
      benefitsTitle: "Why Pharma Vet?",
      benefits: ["Lowest retail prices", "Focus on 1L line", "Fast regional delivery", "European quality"],
      ctaTitle: "Ready to Start?",
      ctaDesc: "Contact us via phone to get detailed terms:",
      ctaBtn: "Call Now",
      phone: "+995 599 00 00 00"
    },
    RU: {
      title: "Станьте нашим партнером",
      subtitle: "Компания Pharma Vet предлагает частным региональным ветаптекам сотрудничество по нашим 1-литровым препаратам для птиц по ценам более конкурентным, чем у любой другой компании.",
      videoPlaceholder: "Видео-инструкция скоро появится",
      steps: [
        { title: "Консультация", desc: "Свяжитесь с нами по телефону для получения информации о ценах." },
        { title: "Предложение", desc: "Мы адаптируем условия под потребности вашей аптеки." },
        { title: "Доставка", desc: "Доставим продукцию в кратчайшие сроки по лучшим ценам." }
      ],
      benefitsTitle: "Почему Pharma Vet?",
      benefits: ["Самые низкие цены", "Фокус на 1л линии", "Быстрая доставка", "Европейское качество"],
      ctaTitle: "Готовы начать?",
      ctaDesc: "Свяжитесь с нами по телефону для уточнения условий:",
      ctaBtn: "Позвонить",
      phone: "+995 599 00 00 00"
    }
  };

  const t = content[lang] || content.GE;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700">
      
      {/* Hero Section with Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        
        {/* Left Side: Text Content */}
        <div className="text-left space-y-6">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter uppercase leading-[0.95]">
            {t.title}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* Right Side: Video Placeholder */}
        <div className="relative group">
          <div className="aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center relative shadow-2xl border-[6px] border-white ring-1 ring-slate-200">
            {/* აქ ჩაჯდება ვიდეო სამომავლოდ (iframe) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent"></div>
            <PlayCircle className="w-16 h-16 text-white/40 group-hover:text-teal-400 group-hover:scale-110 transition-all duration-500 cursor-pointer" />
            <span className="mt-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              {t.videoPlaceholder}
            </span>
          </div>
          {/* Decorative Back Element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {t.steps.map((step, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[2.5rem] border-2 border-teal-50 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all group">
            <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-8 font-black text-2xl group-hover:rotate-12 transition-transform">
              {idx + 1}
            </div>
            <h3 className="text-xl font-black text-slate-950 mb-4 uppercase tracking-tighter">
              {step.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Benefits & CTA Section */}
      <div className="bg-slate-950 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter border-l-4 border-teal-500 pl-6">
              {t.benefitsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {t.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="bg-teal-500/20 p-1.5 rounded-lg">
                    <CheckCircle2 className="text-teal-500 w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="font-bold text-sm text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 text-center shadow-2xl">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-slate-400 text-sm mb-10 font-medium">
              {t.ctaDesc}
            </p>
            <div className="space-y-4">
               <a 
                 href={`tel:${t.phone}`}
                 className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 group text-xl shadow-lg shadow-teal-500/20"
               >
                 <Phone className="w-6 h-6 fill-white" />
                 {t.phone}
               </a>
               <div className="flex items-center justify-center gap-2">
                 <div className="h-px w-8 bg-slate-800"></div>
                 <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
                   {t.ctaBtn}
                 </p>
                 <div className="h-px w-8 bg-slate-800"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-24 pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-40">
        {[
          { icon: ShieldCheck, label: "Certified" },
          { icon: Building2, label: "Regional Hub" },
          { icon: Zap, label: "Fast Logistic" },
          { icon: TrendingDown, label: "Best Prices" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            <item.icon className="w-8 h-8 text-slate-900" />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BecomePartner;