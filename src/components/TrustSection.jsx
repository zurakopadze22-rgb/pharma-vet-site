import React from 'react';
import { ShieldCheck, Truck, Warehouse, BadgeCheck } from 'lucide-react';

const TrustSection = ({ t, lang }) => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: lang === 'GE' ? 'ევროპული ხარისხი' : 'European Quality',
      desc: lang === 'GE' ? 'ყველა პროდუქტი ფლობს საერთაშორისო GMP და ISO სერთიფიკატებს.' : 'All products hold international GMP and ISO certificates.'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: lang === 'GE' ? 'Cold Chain ლოჯისტიკა' : 'Cold Chain Logistics',
      desc: lang === 'GE' ? 'ტემპერატურული რეჟიმის მკაცრი დაცვა ტრანსპორტირებისას.' : 'Strict temperature control during transportation.'
    },
    {
      icon: <Warehouse className="w-8 h-8" />,
      title: lang === 'GE' ? 'სტანდარტული საწყობი' : 'Standard Warehouse',
      desc: lang === 'GE' ? 'პროდუქციის შენახვა ხდება დაცულ და კონტროლირებად გარემოში.' : 'Products are stored in a protected and controlled environment.'
    },
    {
      icon: <BadgeCheck className="w-8 h-8" />,
      title: lang === 'GE' ? 'ექსკლუზიური იმპორტი' : 'Exclusive Import',
      desc: lang === 'GE' ? 'წამყვანი მსოფლიო ბრენდების ერთადერთი წარმომადგენელი.' : 'Exclusive representative of leading world brands.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase mb-4">
            {lang === 'GE' ? 'რატომ Pharma Vet?' : 'Why Pharma Vet?'}
          </h2>
          <div className="h-1.5 w-20 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="group p-8 bg-white border-4 border-teal-100 rounded-[2.5rem] hover:border-teal-500 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* მომწვანო გრადიენტის ეფექტი ფონზე */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500 shadow-sm">
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter italic">
                  {f.title}
                </h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed italic">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;