import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Truck, RotateCcw, Factory, 
  Package, Info, ChevronDown, BookOpen, Globe,
  Printer, Facebook, MessageCircle, Copy, Check, Share2
} from 'lucide-react';
import { translations } from "../translations";
import { useSEO } from '../hooks/useSEO';
import { useToast } from '../context/ToastContext';

const ProductDetail = ({ lang, allProducts = [], onProductClick, t, onBack }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addToast } = useToast();
  const ct = translations[lang].catalog;

  const product = useMemo(() => {
    return allProducts.find(p => p.slug === slug);
  }, [slug, allProducts]);

  useEffect(() => {
    if (!product && allProducts.length > 0) {
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [product, allProducts, navigate]);

  const brandName = lang === 'GE' ? 'ფარმავეტი' : lang === 'EN' ? 'Pharma Vet' : 'Фарма Вет';

  const getSubCategoryLabel = (sub) => {
    if (!sub) return null;
    const key = `sub_${sub}`;
    return ct[key] || sub;
  };

  const indicationsList = useMemo(() => {
    if (!product) return [];
    if (product.indications?.[lang]) return product.indications[lang];

    const textToScan = `${product.purpose?.[lang] || ''} ${product.fullDetails?.[lang] || ''}`.toLowerCase();
    
    const knownDiseases = [
      { key: 'მასტიტი', label: { GE: 'მასტიტი (ძუძუს ანთება)', EN: 'Mastitis', RU: 'Мастит' } },
      { key: 'ენდომეტრიტი', label: { GE: 'ენდომეტრიტი', EN: 'Endometritis', RU: 'Эндометрит' } },
      { key: 'დიარეა', label: { GE: 'დიარეა / ფაღარათი', EN: 'Diarrhea', RU: 'Диарея' } },
      { key: 'ფაღარათი', label: { GE: 'ფაღარათი / დიარეა', EN: 'Diarrhea', RU: 'Диарея' } },
      { key: 'კოლისეპტიცემია', label: { GE: 'კოლისეპტიცემია (E.Coli)', EN: 'Colisepticemia', RU: 'Колисептицемия' } },
      { key: 'ბრონქოპნევმონია', label: { GE: 'ბრონქოპნევმონია', EN: 'Bronchopneumonia', RU: 'Бронхопневмония' } },
      { key: 'პნევმონია', label: { GE: 'პნევმონია (ფილტვების ანთება)', EN: 'Pneumonia', RU: 'Пневмония' } },
      { key: 'საჰაერო პარკის', label: { GE: 'საჰაერო პარკის ინფექცია', EN: 'Air Sac Infection', RU: 'Инфекция воздушных мешков' } },
      { key: 'კორიზა', label: { GE: 'ინფექციური კორიზა', EN: 'Infectious Coryza', RU: 'Инфекционный ринит' } },
      { key: 'ქოლერა', label: { GE: 'ფრინველის ქოლერა', EN: 'Fowl Cholera', RU: 'Холера птиц' } },
      { key: 'კოკციდიოზი', label: { GE: 'კოკციდიოზი', EN: 'Coccidiosis', RU: 'Кокцидиоз' } },
      { key: 'ინფექცი', label: { GE: 'ბაქტერიული ინფექციები', EN: 'Bacterial Infections', RU: 'Бактериальные инфекции' } },
      { key: 'დეჰიდრატაცია', label: { GE: 'დეჰიდრატაცია (გამოფიტვა)', EN: 'Dehydration', RU: 'Дегидратация' } },
      { key: 'ვიტამინებ', label: { GE: 'ვიტამინების დეფიციტი', EN: 'Vitamin Deficiency', RU: 'Авитаминоз' } },
      { key: 'სტრეს', label: { GE: 'სტრესული პირობები', EN: 'Stress Conditions', RU: 'Стрессовые состояния' } },
      { key: 'ჩონჩხის', label: { GE: 'ძვლოვანი სისტემის დარღვევები', EN: 'Skeletal Disorders', RU: 'Нарушения скелета' } },
      { key: 'ჭიპლარის', label: { GE: 'ჭიპლარის ანთება', EN: 'Omphalitis', RU: 'Воспаление пуповины' } }
    ];

    const matched = [];
    knownDiseases.forEach(d => {
      if (textToScan.includes(d.key) && !matched.some(m => m.GE === d.label.GE)) {
        matched.push(d.label);
      }
    });

    if (matched.length === 0) {
      matched.push({ GE: 'ვეტერინარული მკურნალობა & პრევენცია', EN: 'Veterinary Treatment & Prevention', RU: 'Ветеринарное лечение и профилактика' });
    }
    return matched;
  }, [product, lang]);

  const indicationsText = indicationsList.map(i => i[lang] || i.GE).join(', ');

  const schema = product ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": product.name[lang],
        "image": product.image.startsWith('http') 
          ? product.image 
          : `https://www.pharmavet.ge${product.image}`,
        "description": `${product.name[lang]} - გამოიყენება ვეტერინარიაში შემდეგი დაავადებების დროს: ${indicationsText}. ${product.purpose?.[lang] || ''}`,
        "brand": {
          "@type": "Brand",
          "name": product.manufacturer
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "GEL",
          "price": product.price.toString(),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "priceValidUntil": "2027-01-01"
        },
        "sku": `PV-${product.id}`
      }
    ]
  } : null;

  const seoTitle = product ? `${product.name[lang]} - ${indicationsList[0]?.[lang] || 'მკურნალობა'} | ${brandName}` : '';
  const seoDescription = product ? `${product.name[lang]} - გამოიყენება ვეტერინარიაში ${indicationsText}-ს სამკურნალოდ. დოზირება, ინსტრუქცია, ფასი PharmaVet-ზე.` : '';

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: product ? `${product.name[lang]}, ${indicationsText}, ვეტერინარული პრეპარატები, ${product.manufacturer}, ფარმავეტი` : '',
    ogTitle: product?.name[lang],
    ogDescription: seoDescription,
    ogImage: product?.image.startsWith('http') ? product.image : `https://www.pharmavet.ge${product?.image}`,
    schema,
    lang
  });

  const similarProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (!product) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = product.name[lang];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
    viber: `viber://forward?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast(lang === 'GE' ? 'პროდუქტის ბმული დაკოპირდა!' : 'Product link copied!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintInstruction = () => {
    window.print();
  };

  return (
    <>
      {/* 📄 Printable Instruction Sheet (Shows ONLY when printing) */}
      <div id="printable-instruction" className="hidden print:block p-8 bg-white text-slate-900 font-sans">
        <div className="flex justify-between items-center border-b-2 border-teal-600 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.webp" alt="Pharma Vet" className="h-16 object-contain" />
            <div>
              <h1 className="text-xl font-black uppercase text-slate-900">Pharma Vet Georgia</h1>
              <p className="text-xs font-bold text-teal-600">ვეტერინარული პრეპარატების ოფიციალური დისტრიბუცია</p>
              <p className="text-[10px] text-slate-500">www.pharmavet.ge • info@pharmavet.ge</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ოფიციალური დოკუმენტი</span>
            <span className="text-xs font-black uppercase text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 inline-block mt-1">
              გამოყენების ინსტრუქცია
            </span>
          </div>
        </div>

        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-2xl font-black uppercase text-slate-950 mb-2">{product.name[lang]}</h2>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
            <span>მწარმოებელი: <strong>{product.manufacturer}</strong></span>
            <span>•</span>
            <span>მოცულობა: <strong>{product.volume?.[lang]}</strong></span>
            <span>•</span>
            <span>ექსპორტიორი: <strong>{product.exporter || 'Pharma Vet'}</strong></span>
          </div>
        </div>

        <div className="space-y-6 text-xs leading-relaxed text-slate-800">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-black uppercase text-teal-700 text-sm mb-2">💉 სამკურნალო ჩვენებები / დაავადებები:</h3>
            <p className="font-bold text-slate-900 mb-2">{indicationsText}</p>
            <p className="whitespace-pre-line text-slate-700 font-medium">{product.purpose?.[lang]}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-black uppercase text-teal-700 text-sm mb-2">💊 მიღების წესი და დოზირება:</h3>
            <p className="font-medium whitespace-pre-line text-slate-800">
              {product.usage?.[lang] || 'გამოიყენება ვეტერინარის დანიშნულებით.'}
            </p>
          </div>

          {product.fullDetails?.[lang] && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-black uppercase text-slate-900 text-sm mb-2">📝 დეტალური აღწერა და ინსტრუქცია:</h3>
              <p className="whitespace-pre-line text-slate-700 font-normal leading-relaxed">{product.fullDetails[lang]}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
          <span>Pharma Vet Georgia • ვეტერინარული პრეპარატების პორტალი</span>
          <span>www.pharmavet.ge</span>
        </div>
      </div>

      {/* Screen View */}
      <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700 no-print">
        
        <button 
          onClick={() => navigate('/products')} 
          className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[9px] uppercase mb-6 transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">
          
          {/* სურათის სექცია */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-full max-w-[420px] mb-8">
              <div className="border-[4px] border-teal-100 rounded-[2.5rem] overflow-hidden shadow-xl bg-white aspect-square flex items-center justify-center p-6">
                <img 
                  src={product.image} 
                  className="w-full h-full object-contain hover:scale-105 transition duration-700" 
                  alt={`${product.name[lang]} - ${indicationsText} - ${brandName}`} 
                />
              </div>
            </div>

            {/* უპირატესობების აიქონები */}
            <div className="w-full max-w-[420px] flex justify-between px-2 opacity-80 mb-6">
              {[{ Icon: ShieldCheck, txt: t.feat1 }, { Icon: Truck, txt: t.feat2 }, { Icon: RotateCcw, txt: t.feat3 }].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                    <item.Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-tight max-w-[60px]">{item.txt}</span>
                </div>
              ))}
            </div>

            {/* 📄 ინსტრუქციის ამობეჭდვის ღილაკი */}
            <div className="w-full max-w-[420px]">
              <button
                onClick={handlePrintInstruction}
                className="w-full py-3.5 px-6 bg-slate-900 text-white hover:bg-teal-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                {lang === 'GE' ? '📄 ინსტრუქციის ამობეჭდვა (PDF)' : '📄 Print Instruction Sheet (PDF)'}
              </button>
            </div>
          </div>

          {/* ინფორმაციის სექცია */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
                  {product.manufacturer}
                </span>
                {product.sub && (
                  <span className="bg-teal-50 text-teal-600 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
                    {getSubCategoryLabel(product.sub)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-950 mb-6 tracking-tighter leading-tight uppercase">
                {product.name[lang]}
              </h1>

              <div className="flex flex-wrap gap-4 items-stretch mb-6">
                <div className="bg-teal-600 text-white px-7 py-4 rounded-[1.8rem] shadow-lg shadow-teal-100 flex flex-col justify-center min-w-[130px]">
                  <span className="text-[8px] font-black uppercase opacity-70 mb-1 tracking-widest">
                    {lang === 'GE' ? 'ღირებულება' : lang === 'EN' ? 'Price' : 'Цена'}
                  </span>
                  <span className="text-2xl font-black leading-none tracking-tighter">
                    {product.price.toFixed(1)} ₾
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-100 px-7 py-4 rounded-[1.8rem] flex flex-col justify-center min-w-[150px] hover:border-teal-100 transition-colors shadow-sm">
                  <span className="text-[8px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5 tracking-widest">
                    <Package className="w-3.5 h-3.5 text-teal-500" /> 
                    {lang === 'GE' ? 'მოცულობა' : lang === 'EN' ? 'Volume' : 'Объем'}
                  </span>
                  <span className="text-lg font-black text-slate-900 leading-none">
                    {product.volume?.[lang]}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/30 flex items-center gap-3">
                <Factory className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.manufacturer_label}</p>
                  <p className="text-[11px] font-black text-slate-900 leading-none">{product.manufacturer}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-[1.5rem] border-2 border-teal-100/30 flex items-center gap-3">
                <Globe className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{t.exporter_label || "ექსპორტიორი"}</p>
                  <p className="text-[11px] font-black text-slate-900 leading-none">{product.exporter || "Pharma Vet"}</p>
                </div>
              </div>
            </div>
            
            {/* 💉 რა დაავადებებს მკურნალობს (ჩვენებები) */}
            <div className="mb-6 bg-teal-50/50 p-5 rounded-[1.5rem] border border-teal-100">
              <h2 className="text-[10px] font-black text-teal-700 uppercase mb-2 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-teal-600" /> 
                {lang === 'GE' ? '💉 რა დაავადებებს მკურნალობს? (ჩვენებები)' : lang === 'EN' ? '💉 Diseases Treated / Indications' : '💉 Показания к применению'}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {indicationsList.map((ind, idx) => (
                  <span key={idx} className="bg-white text-teal-800 font-bold text-[10px] px-3 py-1 rounded-full border border-teal-200 shadow-sm">
                    #{ind[lang] || ind.GE}
                  </span>
                ))}
              </div>
              <p className="text-teal-900 text-xs font-bold leading-relaxed whitespace-pre-line mt-3">
                {product.purpose?.[lang]}
              </p>
            </div>

            {/* ❓ ხშირად დასმული კითხვები (FAQ) */}
            <div className="mb-6 bg-white p-5 rounded-[1.5rem] border-2 border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                {lang === 'GE' ? '❓ ხშირად დასმული კითხვები (FAQ)' : lang === 'EN' ? '❓ Frequently Asked Questions' : '❓ Частые вопросы'}
              </h2>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="font-black text-slate-800 mb-1">
                    Q: {lang === 'GE' ? `რა დაავადებების დროს გამოიყენება ${product.name[lang]}?` : `What is ${product.name[lang]} used for?`}
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                    A: {product.name[lang]} {lang === 'GE' ? `ეფექტურია შემდეგი დაავადებების მკურნალობისას: ${indicationsText}.` : `is used for: ${indicationsText}.`}
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="font-black text-slate-800 mb-1">
                    Q: {lang === 'GE' ? `როგორ ხდება ${product.name[lang]}-ის მიღება?` : `How to administer ${product.name[lang]}?`}
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                    A: {product.usage?.[lang]}
                  </p>
                </div>
              </div>
            </div>

            {/* 📲 სოციალური გაზიარება */}
            <div className="mb-8 pt-4 border-t border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                {lang === 'GE' ? 'პროდუქტის გაზიარება' : 'Share Product'}
              </span>
              <div className="flex flex-wrap gap-2">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  <Facebook className="w-3.5 h-3.5 fill-current" /> FB
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" /> WA
                </a>
                <a href={shareLinks.viber} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#7360F2] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  <Share2 className="w-3.5 h-3.5" /> Viber
                </a>
                <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md ${copied ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'OK' : 'LINK'}
                </button>
              </div>
            </div>

            <div className="border-2 border-slate-100 rounded-[1.5rem] overflow-hidden bg-white mb-8">
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)} 
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">{t.full_details_btn}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`transition-all duration-500 overflow-hidden ${isDetailsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 text-slate-600 text-[11px] leading-relaxed border-t border-slate-100 bg-slate-50/30 whitespace-pre-line font-medium">
                  {product.fullDetails?.[lang]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* მსგავსი პროდუქტები */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-black text-slate-950 mb-8 uppercase tracking-tighter">
               {lang === 'GE' ? 'მსგავსი პროდუქცია' : lang === 'EN' ? 'Similar Products' : 'Похожие товары'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    navigate(`/product/${item.slug}`);
                    window.scrollTo(0, 0);
                  }} 
                  className="group cursor-pointer bg-white border-2 border-teal-50 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all duration-300"
                >
                  <div className="aspect-square p-4 flex items-center justify-center bg-white">
                    <img src={item.image} alt={item.name[lang]} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="p-4 bg-slate-50/50">
                    <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase line-clamp-2 min-h-[2rem] mb-2">{item.name[lang]}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-teal-600">{item.price.toFixed(1)} ₾</span>
                      <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                        <Info className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;