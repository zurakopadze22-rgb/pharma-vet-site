import React from 'react';

const BrandsSlider = ({ lang }) => {
  // სატესტო ლოგოები
  const brands = [
    "BioVet", "NatureFeed", "VetPharm", "HealthPet", "VetiCare", "PharmVet", "GlobalVet"
  ];

  return (
    // დაემატა ნაზი გრადიენტი ფონზე და გაიზარდა padding
    <div className="py-16 bg-gradient-to-b from-white to-slate-50 border-y border-slate-100/50 overflow-hidden relative">
       
       {/* დეკორატიული ელემენტები ფონზე */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

      {/* განახლებული სათაური: ცენტრალური და დიდი */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-slate-900 mb-4">
          {lang === 'GE' ? 'ჩვენი ოფიციალური პარტნიორები' : 'Our Official Partners'}
        </h3>
        {/* პატარა თილისფერი ხაზი სათაურის ქვეშ */}
        <div className="h-1 w-16 bg-teal-500 rounded-full mx-auto opacity-80"></div>
      </div>
      
      {/* უწყვეტი სლაიდერი */}
      <div className="flex overflow-hidden relative z-10 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
        <div className="flex gap-8 animate-loop-scroll hover:paused py-4">
          {[...brands, ...brands].map((brand, idx) => (
            // განახლებული ლოგოების დიზაინი: ბლოკები ტექსტით
            <div 
              key={idx} 
              className="group/item flex items-center justify-center min-w-[180px] h-24 bg-white rounded-[1.5rem] border-2 border-slate-100 px-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 cursor-default"
            >
              <span className="text-2xl font-black text-slate-400 group-hover/item:text-teal-600 transition-colors tracking-tighter filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsSlider;