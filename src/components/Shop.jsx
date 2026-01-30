import React, { useState } from 'react';
import { Info } from 'lucide-react';

const Shop = ({ t, lang, onProductClick, products }) => {
  const [activeTab, setActiveTab] = useState('all');

  const safeProducts = products || [];
  const filteredProducts = (activeTab === 'all' 
    ? safeProducts 
    : safeProducts.filter(p => p.category === activeTab)
  ).slice(0, 15);

  return (
    <section id="shop" className="py-5 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 uppercase">
            {t.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-12">
            {/* კატეგორიების ბარათები (ფერები იგივე დავტოვე, რადგან ეს სექცია მხოლოდ მთავარზეა) */}
            <div onClick={() => setActiveTab(activeTab === 'nutrition' ? 'all' : 'nutrition')} 
                 className={`relative h-28 md:h-32 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${activeTab === 'nutrition' ? 'border-teal-500 shadow-xl scale-[1.02]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-widest text-sm md:text-base">{t.nutrition}</div>
            </div>

            <div onClick={() => setActiveTab(activeTab === 'pharma' ? 'all' : 'pharma')} 
                 className={`relative h-28 md:h-32 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${activeTab === 'pharma' ? 'border-teal-500 shadow-xl scale-[1.02]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-widest text-sm md:text-base">{t.pharma}</div>
            </div>

            <div onClick={() => setActiveTab(activeTab === 'care' ? 'all' : 'care')} 
                 className={`relative h-28 md:h-32 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${activeTab === 'care' ? 'border-teal-500 shadow-xl scale-[1.02]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-widest text-sm md:text-base">
                {lang === 'GE' ? 'ჰიგიენა და მოვლა' : 'Hygiene & Care'}
              </div>
            </div>
          </div>
        </div>

        {/* პროდუქტების ბადე კატალოგის იდენტური ფერებით */}
        <div className="flex flex-wrap justify-center gap-5">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => onProductClick(product)} 
              className="group relative cursor-pointer bg-white border-2 border-teal-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-teal-400 transition-all duration-500 flex flex-col w-[calc(50%-1.25rem)] sm:w-[calc(33.33%-1.25rem)] md:w-[calc(25%-1.25rem)] lg:w-[calc(20%-1.25rem)] xl:w-[calc(16.66%-1.25rem)] min-w-[160px]"
            >
              {/* სურათის სექცია */}
              <div className="aspect-square overflow-hidden bg-white relative flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name[lang]} 
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-700" 
                />
              </div>
              
              {/* ტექსტის სექცია - აქ ჩავასწორეთ ზომები */}
              <div className="p-4 flex flex-col flex-grow transition-all duration-500 bg-gradient-to-b from-slate-50/50 via-teal-50/80 to-teal-100/90 group-hover:from-teal-50 group-hover:to-teal-200/80">
                <span className="text-[8px] font-black text-teal-700 uppercase tracking-widest mb-2 px-2 py-0.5 bg-white/80 rounded-full inline-block w-fit border border-teal-200/50">
                  {product.manufacturer}
                </span>
                
                {/* პროდუქტის სახელი: 
                    text-[12px] - ზომა ოდნავ შემცირდა
                    line-clamp-3 - ახლა უკვე 3 ხაზი დასაშვებია
                    min-h-[3.2rem] - სიმაღლე გარანტირებულად იტევს 3 ხაზს
                */}
                <h4 className="text-[12px] font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-800 transition-colors line-clamp-3 min-h-[3.2rem] uppercase tracking-tighter">
                  {product.name[lang]}
                </h4>
                
                <div className="mt-auto pt-3 border-t border-teal-200/50 flex items-center justify-between transition-all">
                  <span className="text-sm font-black text-slate-950">
                    {product.price.toFixed(1)} 
                    <span className="text-teal-600 text-[10px] italic font-bold ml-1">₾</span>
                  </span>
                  
                  <div className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm border border-teal-200 group-hover:border-teal-500">
                    <Info className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;