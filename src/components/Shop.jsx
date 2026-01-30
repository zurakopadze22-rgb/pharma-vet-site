import React, { useState } from 'react';
import { Info } from 'lucide-react';

const Shop = ({ t, lang, onProductClick, products }) => {
  const [activeTab, setActiveTab] = useState('all');

  const safeProducts = products || [];
  const filteredProducts = (activeTab === 'all' 
    ? safeProducts 
    : safeProducts.filter(p => p.category === activeTab)
  ).slice(0, 12); // რაოდენობა ოდნავ შევამცირეთ უკეთესი ვიზუალისთვის

  return (
    <section id="shop" className="py-10 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 uppercase">
            {t.title}
          </h2>
          
          {/* კატეგორიების ბარათები - მობილურზე კომპაქტური (3 სვეტი) */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-5xl mx-auto mb-12">
            <div onClick={() => setActiveTab(activeTab === 'nutrition' ? 'all' : 'nutrition')} 
                 className={`relative h-20 sm:h-28 md:h-36 rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer border-2 md:border-4 transition-all duration-300 ${activeTab === 'nutrition' ? 'border-teal-500 shadow-lg scale-[1.05]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-tighter md:tracking-widest text-[10px] sm:text-sm md:text-base text-center px-1">
                {t.nutrition}
              </div>
            </div>

            <div onClick={() => setActiveTab(activeTab === 'pharma' ? 'all' : 'pharma')} 
                 className={`relative h-20 sm:h-28 md:h-36 rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer border-2 md:border-4 transition-all duration-300 ${activeTab === 'pharma' ? 'border-teal-500 shadow-lg scale-[1.05]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-tighter md:tracking-widest text-[10px] sm:text-sm md:text-base text-center px-1">
                {t.pharma}
              </div>
            </div>

            <div onClick={() => setActiveTab(activeTab === 'care' ? 'all' : 'care')} 
                 className={`relative h-20 sm:h-28 md:h-36 rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer border-2 md:border-4 transition-all duration-300 ${activeTab === 'care' ? 'border-teal-500 shadow-lg scale-[1.05]' : 'border-teal-100 hover:border-teal-300'}`}>
              <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white uppercase tracking-tighter md:tracking-widest text-[10px] sm:text-sm md:text-base text-center px-1">
                {lang === 'GE' ? 'მოვლა' : 'Care'}
              </div>
            </div>
          </div>
        </div>

        {/* პროდუქტების ბადე - დესკტოპზე უფრო დიდი ბარათები (4 სვეტი მაქსიმუმ) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => onProductClick(product)} 
              className="group relative cursor-pointer bg-white border-2 border-teal-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-teal-400 transition-all duration-500 flex flex-col 
              w-[calc(50%-0.5rem)] 
              md:w-[calc(33.33%-1.5rem)] 
              lg:w-[calc(25%-2rem)] 
              min-w-[150px] max-w-[320px]"
            >
              {/* სურათი */}
              <div className="aspect-square overflow-hidden bg-white relative flex items-center justify-center p-6">
                <img 
                  src={product.image} 
                  alt={product.name[lang]} 
                  className="w-full h-full object-contain group-hover:scale-110 transition duration-700" 
                />
              </div>
              
              {/* ტექსტი */}
              <div className="p-5 md:p-7 flex flex-col flex-grow bg-gradient-to-b from-slate-50/50 via-teal-50/80 to-teal-100/90 group-hover:from-teal-50 group-hover:to-teal-200/80">
                <span className="text-[9px] md:text-[10px] font-black text-teal-700 uppercase tracking-widest mb-3 px-3 py-1 bg-white rounded-full inline-block w-fit border border-teal-200/50">
                  {product.manufacturer}
                </span>
                
                <h4 className="text-sm md:text-lg font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-800 transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] uppercase tracking-tighter">
                  {product.name[lang]}
                </h4>
                
                <div className="mt-auto pt-4 border-t border-teal-200/50 flex items-center justify-between">
                  <span className="text-base md:text-xl font-black text-slate-950">
                    {product.price.toFixed(1)} 
                    <span className="text-teal-600 text-xs italic font-bold ml-1">₾</span>
                  </span>
                  
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-md border border-teal-100 group-hover:border-teal-500">
                    <Info className="w-5 h-5 md:w-6 md:h-6" />
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