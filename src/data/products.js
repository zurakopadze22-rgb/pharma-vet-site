// src/data/products.js
export const productsData = [
  // --- არსებული პროდუქტები ---
  {
  id: 1,
  name: { 
    GE: "VN-AD3ECK ხსნარი პერორალური მიღებისთვის", 
    EN: "VN-AD3ECK Oral solution", 
    RU: "VN-AD3ECK Оральный раствор" 
  },
  category: "pharma",
  sub: "supplement",
  price: 50.0,
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "https://www.vmnpharma.com/wp-content/uploads/2022/08/vn-ad3-eck.jpg",
  volume: { GE: "1 ლ ", EN: "1 L ", RU: "1 л " },
  
  // მოკლე დანიშნულება (მთავარ გვერდზე გამოსაჩენად)
  purpose: { 
    GE: "VN-AD3ECK არის თხევადი ვიტამინების კომპლექსი (A, D3, E, C, K) სასმელ წყალში გასახსნელად, რომელიც აძლიერებს ცხოველთა იმუნიტეტს და ხელს უწყობს მათ ჯანსაღ განვითარებას.", 
    EN: "VN-AD3ECK is a liquid vitamin premix (A, D3, E, C, K) administered via drinking water to support the immune system and general health of animals.", 
    RU: "VN-AD3ECK — это жидкий витаминный комплекс (A, D3, E, C, K) для добавления в питьевую воду, поддерживающий иммунитет и здоровое развитие животных." 
  },

  // მოკლე გამოყენების წესი (ბარათზე გამოსაჩენად)
  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, by mixing with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  // სამიზნე სახეობები
  species: ['bird', 'livestock', 'horse'],

  // სრული ინფორმაცია, რომელიც ღილაკზე დაჭერისას ჩამოიშლება
  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
• ვიტამინების (A, D3, E, C, K) დეფიციტის დროს.
• ძვლოვანი და ჩონჩხის სისტემის დარღვევებისას.
• სტრესულ პირობებში (ტრანსპორტირება, ვაქცინაცია, ტემპერატურის და კლიმატის ცვლილება).
• იმუნური სისტემის გასაძლიერებლად და ანტიოქსიდანტური დაცვისთვის.
• ზრდის ტემპის და საკვების კონვერტაციის (FCR) გასაუმჯობესებლად.
• სისხლის შედედების პროცესების ხელშესაწყობად.

შემადგენლობა: ვიტამინი A, D3, C, E, K.

რეკომენდებული დოზირება:
• ფრინველი (ბროილერი): 500 მლ - 1 ლ / 1000 ლ სასმელ წყალზე.
• ფრინველი (კვერცხმდებელი): 1 - 1.5 ლ / 1000 ლ სასმელ წყალზე.
• ხბო და კვიცი: 5 მლ ცხოველზე, სასმელ წყალში შერევით.
• მსხვილფეხა რქოსანი პირუტყვი და ცხენი: 10 მლ ცხოველზე.`,

    EN: `DIRECTIONS FOR USE:
Used in case of vitamin deficiencies (A, D3, E, C, K). Also used as supportive for:
• Bone and skeletal system disorders.
• Stress conditions (transport, beak cutting, vaccination, climate changes).
• Immune system support with antioxidant properties.
• Body growth, reproductive performance and feed conversion rate (FCR).
• Blood clotting.

COMPOSITION: Vitamin A, Vitamin D3, Vitamin C, Vitamin E, Vitamin K.

RECOMMENDED USAGE:
• Poultry (Broiler): 500 mL - 1 L / 1000 L drinking water.
• Poultry (Layers/Breeders): 1 - 1.5 L / 1000 L drinking water.
• Calves and Foals: 5 mL per animal, mixed with water.
• Cattle and Horses: 10 mL per animal, mixed with water.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Применяется при дефиците витаминов (A, D3, E, C, K). Также используется для:
• Нарушений костной и скелетной системы.
• Стрессовых состояний (транспортировка, вакцинация, изменения климата).
• Поддержки иммунной системы и антиоксидантной защиты.
• Роста организма и улучшения конверсии корма (FCR).
• Свертываемости крови.

СОСТАВ: Витамин А, Витамин D3, Витамин С, Витамин Е, Витамин К.

РЕКОМЕНДУЕМАЯ ДОЗИРОВКА:
• Птица (бройлеры): 500 мл - 1 л на 1000 л питьевой воды.
• Птица (несушки): 1 - 1,5 л на 1000 л питьевой воды.
• Телята и жеребята: 5 мл на животное, с питьевой водой.
• Крупный рогатый скот и лошади: 10 мл на животное.`
  }
},
  {
  id: 2, // ან შემდეგი რიგი ნომერი
  name: { 
    GE: "PHOSDCAL-VN ხსნარი პერორალური მიღებისთვის", 
    EN: "PHOSDCAL-VN Oral solution", 
    RU: "PHOSDCAL-VN Оральный раствор" 
  },
  category: "pharma",
  sub: "supplement",
  price: 32.0, // ფასი შეგიძლია შეცვალო
  manufacturer: "Mistav",
    exporter: "VMN Pharmaceuticals",

  image: "https://www.vmnpharma.com/wp-content/uploads/2022/08/phosdcal-vn.jpg",
  volume: { GE: "1 ლ / 5 ლ", EN: "1 L / 5 L", RU: "1 л / 5 л" },
  
  purpose: { 
    GE: "მინერალური საკვები დანამატი. გამოიყენება ჩონჩხის სისტემის განვითარებისა და მინერალური ბალანსის აღსადგენად.", 
    EN: "Mineral feed supplement. Used for skeletal system development and restoring mineral balance.", 
    RU: "Минеральная кормовая добавка. Используется для развития скелетной системы и восстановления минерального баланса."},

  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, mixed with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  species: ['bird', 'livestock', 'horse'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
PHOSDCAL-VN გამოიყენება მინერალების (ფოსფორი, კალციუმი, მაგნიუმი) დეფიციტის დროს. იგი ხელს უწყობს:
• ძვლოვანი და ჩონჩხის სისტემის ფორმირებასა და გაძლიერებას.
• მეტაბოლური დარღვევების პრევენციას.
• პროდუქტიულობის ზრდას ინტენსიური ზრდის პერიოდში.
• კვერცხის ნაჭუჭის ხარისხის გაუმჯობესებას.

შემადგენლობა: ფოსფორი, კალციუმი, მაგნიუმი, ნატრიუმი, მანგანუმი, თუთია, სპილენძი, კობალტი, სელენი.

რეკომენდებული დოზირება:
• ფრინველი (ბროილერი და კვერცხმდებელი): 1-2 ლიტრი / 1000 ლიტრ სასმელ წყალზე.
• მსხვილფეხა რქოსანი პირუტყვი (ძროხა, კამეჩი): 20-50 მლ დღეში, სასმელ წყალში შერევით.
• ხბო, ცხვარი, თხა: 10-20 მლ დღეში.
• ღორი: 10-20 მლ დღეში.
• ცხენი: 20-50 მლ დღეში.

რეკომენდებულია კურსის ჩატარება 3-5 დღის განმავლობაში.`,

    EN: `DIRECTIONS FOR USE:
Used to supplement mineral deficiencies (Phosphorus, Calcium, Magnesium). It supports:
• Formation and strengthening of the skeletal system.
• Prevention of metabolic disorders.
• Increased productivity during intensive growth.
• Improving eggshell quality.

COMPOSITION: Phosphorus, Calcium, Magnesium, Sodium, Manganese, Zinc, Copper, Cobalt, Selenium.

RECOMMENDED USAGE:
• Poultry (Broilers & Layers): 1-2 L / 1000 L drinking water.
• Cattle (Cows, Buffaloes): 20-50 mL per day, mixed with water.
• Calves, Sheep, Goats: 10-20 mL per day.
• Swine (Pigs): 10-20 mL per day.
• Horses: 20-50 mL per day.

Recommended treatment duration: 3-5 consecutive days.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Применяется для восполнения дефицита минералов (фосфор, кальций, магний). Продукт способствует:
• Формированию и укреплению скелетной системы.
• Предотвращению метаболических нарушений.
• Повышению продуктивности в периоды интенсивного роста.
• Улучшению качества яичной скорлупы.

СОСТАВ: Фосфор, Кальций, Магний, Натрий, Марганец, Цинк, Медь, Кобальт, Селен.

РЕКОМЕНДУЕМАЯ ДОЗИРОВКА:
• Птица (бройлеры и несушки): 1-2 литра на 1000 литров воды.
• Крупный рогатый скот (коровы, буйволы): 20-50 мл в день.
• Телята, овцы, козы: 10-20 мл в день.
• Свиньи: 10-20 мл в день.
• Лошади: 20-50 мл в день.

Рекомендуемая продолжительность курса: 3-5 дней.`
  }
},
  {
  id: 3,
  name: { 
    GE: "MINACID-VN ხსნარი პერორალური მიღებისთვის", 
    EN: "MINACID-VN Oral solution", 
    RU: "MINACID-VN Оральный раствор" 
  },
  category: "pharma",
  sub: "supplement",
  price: 38.0,
  manufacturer: "Mistav",
    exporter: "VMN Pharmaceuticals",

  image: "https://www.vmnpharma.com/wp-content/uploads/2022/08/minacid-vn-20-kg.jpg",
  volume: { GE: "1 ლ / 5 ლ", EN: "1 L / 5 L", RU: "1 л / 5 л" },
  
  purpose: { 
    GE: "ორგანული მჟავებისა და მინერალების კომპლექსი. გამოიყენება საჭმლის მონელების გასაუმჯობესებლად და წყლის ჰიგიენისთვის.", 
    EN: "Complex of organic acids and minerals. Used to improve digestion and maintain water hygiene.", 
    RU: "Комплекс органических кислот и минералов. Используется для улучшения пищеварения и гигиены воды." 
  },

  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, mixed with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  species: ['bird', 'livestock'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
MINACID-VN წარმოადგენს ორგანული მჟავებისა და მინერალების დაბალანსებულ ნარევს. იგი ეფექტურია:
• ნაწლავური ფლორის ბალანსის შესანარჩუნებლად და პათოგენური ბაქტერიების ზრდის შესაფერხებლად.
• საკვების მონელებისა და ათვისების კოეფიციენტის გასაუმჯობესებლად.
• სასმელი წყლის pH-ის დასარეგულირებლად და წყლის სისტემაში ლორწოვანი ნადების პრევენციისთვის.
• სტრესული მდგომარეობების მართვისთვის.

შემადგენლობა: რძემჟავა, ლიმონმჟავა, ფორმიატის მჟავა, ფოსფორი, სპილენძი, თუთია.

რეკომენდებული დოზირება:
• ფრინველი (ბროილერი და კვერცხმდებელი): 0.5 - 2 ლიტრი / 1000 ლიტრ სასმელ წყალზე.
• მსხვილფეხა რქოსანი პირუტყვი: 1 - 2 მლ 1 ლიტრ წყალზე.
• ღორი: 1 - 2 მლ 1 ლიტრ წყალზე.

გამოყენების ხანგრძლივობა: 3-5 დღე, ან ვეტერინარის რეკომენდაციით.`,

    EN: `DIRECTIONS FOR USE:
MINACID-VN is a balanced mixture of organic acids and minerals. It is effective for:
• Maintaining the balance of intestinal flora and inhibiting pathogenic bacteria growth.
• Improving feed digestion and conversion rate.
• Regulating drinking water pH and preventing biofilm formation in water systems.
• Managing stress conditions.

COMPOSITION: Lactic acid, Citric acid, Formic acid, Phosphorus, Copper, Zinc.

RECOMMENDED USAGE:
• Poultry (Broilers & Layers): 0.5 - 2 L / 1000 L drinking water.
• Cattle: 1 - 2 mL per 1 L of drinking water.
• Swine (Pigs): 1 - 2 mL per 1 L of drinking water.

Treatment duration: 3-5 consecutive days, or as recommended by a veterinarian.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
MINACID-VN представляет собой сбалансированную смесь органических кислот и минералов. Продукт эффективен для:
• Поддержания баланса кишечной флоры и подавления роста патогенных бактерий.
• Улучшения переваривания корма и коэффициента конверсии.
• Регулирования pH питьевой воды и предотвращения образования биопленки в системах водоснабжения.
• Управления стрессовыми состояниями.

СОСТАВ: Молочная кислота, Лимонная кислота, Муравьиная кислота, Фосфор, Медь, Цинк.

РЕКОМЕНДУЕМАЯ ДОЗИРОВКА:
• Птица (бройлеры и несушки): 0,5 - 2 л на 1000 л питьевой воды.
• Крупный рогатый скот: 1 - 2 мл на 1 л воды.
• Свиньи: 1 - 2 мл на 1 л воды.

Продолжительность применения: 3-5 дней или по рекомендации ветеринара.`
  }
},

  {
  id: 4,
  name: { 
    GE: "AMINOVIT პერორალური ხსნარი", 
    EN: "AMINOVIT Oral solution", 
    RU: "AMINOVIT Оральный раствор" 
  },
  category: "pharma",
  sub: "supplement",
  price: 40.0, 
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/aminovit.jpg",
  // ძირითადი მოცულობა - მხოლოდ 1 ლიტრი
  volume: { GE: "1 ლ", EN: "1 L", RU: "1 л" },
  
  purpose: { 
    GE: "ვიტამინებისა და ამინომჟავების კომპლექსი დეჰიდრატაციის, ელექტროლიტების დისბალანსისა და გამოჯანმრთელების პერიოდისათვის.", 
    EN: "Vitamin and amino acid complex for dehydration, electrolyte imbalance, and recovery periods.", 
    RU: "Комплекс витаминов и аминокислот при дегидратации, электролитном дисбалансе и в период восстановления." 
  },

  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, by mixing with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  species: ['bird', 'livestock', 'horse', 'dog', 'cat'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
AMINOVIT რეკომენდებულია დამხმარე დანამატის სახით შემდეგი შემთხვევების დროს:
• დეჰიდრატაცია, ელექტროლიტებისა და ვიტამინების დისბალანსი.
• ჰიპოპროტეინემია (დიარეის, შოკის და დაღლილობის დროს).
• კვებითი დეფიციტი და გამოჯანმრთელების პერიოდი.
• პრევენციული დანამატი ცხიმოვანი ღვიძლის სინდრომისა და ნერვული აშლილობისას.

შემადგენლობა:
ვიტამინები: A, D3, E, C, B1, B2, B6, B12, K3, დ-ბიოტინი, კალციუმის D-პანტოტენატი, ქოლინის ქლორიდი.
ამინომჟავები: DL-მეთიონინი, L-ლიზინი, L-არგინინი, L-ლეიცინი, L-ვალინი, L-ტიროზინი, L-იზოლეიცინი, L-პროლინი.

რეკომენდებული დოზირება:
• ფრინველი: 250 – 500 მლ / 1 ტონა სასმელ წყალზე, 3-5 დღე.
• ცხენი: 20-30 მლ დღეში.
• ხბოები: 10-20 მლ დღეში.
• ღორი: 5-10 მლ დღეში.
• ბატკნები: 2-4 მლ დღეში.
• კატები და ძაღლები: 1-2 მლ დღეში.

ხელმისაწვდომი შეფუთვები: 5 მლ, 100 მლ, 1 ლ.`,

    EN: `DIRECTIONS FOR USE:
AMINOVIT is recommended as a supportive supplement in cases of:
• Dehydration, electrolyte and vitamin imbalance.
• Hypoproteinemia (during diarrhea, shock, and exhaustion).
• Nutritional deficiency and recovery period.
• Preventive supplement for fatty liver syndrome and nervous disorders.

COMPOSITION:
Vitamins: A, D3, E, C, B1, B2, B6, B12, K3, D-Biotin, Calcium D-Pantothenate, Choline Chloride.
Amino Acids: DL-Methionine, L-Lysine, L-Arginine, L-Leucine, L-Valine, L-Tyrosine, L-Isoleucine, L-Proline.

RECOMMENDED USAGE:
• Poultry: 250 – 500 mL / 1 ton of drinking water for 3-5 days.
• Horse: 20-30 mL per day.
• Calves: 10-20 mL per day.
• Swine (Pigs): 5-10 mL per day.
• Lambs: 2-4 mL per day.
• Cats and Dogs: 1-2 mL per day.

Available packaging: 5 ml, 100 ml, 1 L.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
AMINOVIT рекомендуется в качестве вспомогательной добавки в следующих случаях:
• Дегидратация, дисбаланс электролитов и витаминов.
• Гипопротеинемия (при диарее, шоке и истощении).
• Дефицит питательных веществ и период выздоровления.
• Профилактическая добавка при синдроме жировой дистрофии печени и нервных расстройствах.

СОСТАВ:
Витамины: A, D3, E, C, B1, B2, B6, B12, K3, D-биотин, D-пантотенат кальция, холинхлорид.
Аминокислоты: DL-метионин, L-лизин, L-аргинин, L-лейцин, L-валин, L-тирозин, L-изолейцин, L-пролин.

РЕКОМЕНДУЕМАЯ ДОЗИРОВКА:
• Птица: 250 – 500 мл на 1 тонну питьевой воды, 3-5 дней.
• Лошади: 20-30 мл в день.
• Телята: 10-20 мл в день.
• Свиньи: 5-10 мл в день.
• Ягнята: 2-4 мл в день.
• Кошки и собаки: 1-2 мл в день.

Доступные упаковки: 5 мл, 100 мл, 1 л.`
  }
},
  {
  id: 5, // მიანიჭე შემდეგი თავისუფალი ID
  name: { 
    GE: "DOXYFLO VM პერორალური ხსნარი", 
    EN: "DOXYFLO VM Oral solution", 
    RU: "DOXYFLO VM Оральный раствор" 
  },
  category: "pharma",
  sub: "antibiotic",
  price: 115.0, // ფასი შეგიძლია შეცვალო სურვილისამებრ
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/doxyflo.jpg",
  // ძირითადი მოცულობა - მხოლოდ 1 ლიტრი
  volume: { GE: "1 ლ", EN: "1 L", RU: "1 л" },
  
  purpose: { 
    GE: "ფართო სპექტრის კომბინირებული ანტიბიოტიკი. გამოიყენება სასუნთქი გზებისა და საჭმლის მომნელებელი სისტემის ბაქტერიული ინფექციების სამკურნალოდ.", 
    EN: "Broad-spectrum combined antibiotic. Used for the treatment of bacterial infections of the respiratory and digestive systems.", 
    RU: "Комбинированный антибиотик широкого спектра действия. Применяется для лечения бактериальных инфекций дыхательных путей и пищеварительной системы." 
  },

  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, by mixing with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  species: ['bird', 'livestock'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
პრეპარატი გამოიყენება ფლორფენიკოლისა და დოქსიციკლინის მიმართ მგრძნობიარე ბაქტერიებით გამოწვეული ინფექციების სამკურნალოდ:

ფრინველებში (მეორცეული):
• ბაქტერიული წარმოშობის დიარეა და კოლისეპტიცემია.
• ქრონიკული რესპირატორული დაავადების კომპლექსი (CRD).
• საჰაერო პარკის ინფექცია და სალპინგიტი.
• ქოლერა, კორიზა და სტაფილოკოკური ინფექციები.

ხბოებში:
• ბაქტერიული დიარეა და კოლისეპტიცემია.
• ბრონქოპნევმონია და პოლიართრიტი.
• ხბოს დიფტერია და ჭიპლარის ანთება.

შემადგენლობა (1 გრ-ზე):
• დოქსიციკლინის ჰიკლატი — 100 მგ
• ფლორფენიკოლი — 50 მგ

ხელმისაწვდომი შეფუთვები: 2 გრ, 100 გრ, 1 ლ.`,

    EN: `DIRECTIONS FOR USE:
Used for the treatment of digestive and respiratory tract infections caused by bacteria sensitive to Florfenicol and Doxycycline:

In Poultry (Meat):
• Bacterial diarrhea and colisepticemia.
• Chronic Respiratory Disease (CRD) complex.
• Air sac infection and salpingitis.
• Fowl cholera, coryza, and staphylococcal infections.

In Calves:
• Bacterial diarrhea and colisepticemia.
• Bronchopneumonia and polyarthritis.
• Calf diphtheria and umbilical cord inflammation (omphalitis).

COMPOSITION (per 1 g):
• Doxycycline hyclate — 100 mg
• Florfenicol — 50 mg

Available packaging: 2 g, 100 g, 1 L.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Применяется для лечения инфекций пищеварительного и дыхательного трактов, вызванных бактериями, чувствительными к флорфениколу и доксициклину:

У птиц (мясных пород):
• Бактериальная диарея и колисептицемия.
• Хронические респираторные заболевания (CRD).
• Инфекция воздушных мешков и сальпингит.
• Холера, кориза и стафилококковые инфекции.

У телят:
• Бактериальная диарея и колисептицемия.
• Бронхопневмония и полиартрит.
• Дифтерия телят и воспаление пуповины.

СОСТАВ (на 1 г):
• Доксициклина гиклат — 100 мг
• Флорфеникол — 50 мг

Доступные упаковки: 2 г, 100 г, 1 л.`
  }
},
  {
  id: 6,
  name: { 
    GE: "Phytores-VN პერორალური ხსნარი", 
    EN: "Phytores-VN Oral solution", 
    RU: "Phytores-VN Оральный раствор" 
  },
  category: "pharma",
  sub: "supplement",
  price: 50.0, // ფასი შეგიძლიათ შეცვალოთ
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/phytores.jpg",
  // ძირითადი მოცულობა - მხოლოდ 1 ლიტრი
  volume: { GE: "1 ლ", EN: "1 L", RU: "1 л" },
  
  purpose: { 
    GE: "მცენარეული საკვები დანამატი სასუნთქი სისტემისთვის. იცავს ზედა სასუნთქ გზებს და აქვს ამოსახველებელი ეფექტი.", 
    EN: "Herbal food supplement for the respiratory system. Protects the upper respiratory tract and has an expectorant effect.", 
    RU: "Растительная кормовая добавка для дыхательной системы. Защищает верхние дыхательные пути и обладает отхаркивающим эффектом." 
  },

  usage: { 
    GE: "პერორალურად, სასმელ წყალში შერევით.", 
    EN: "Orally, by mixing with drinking water.", 
    RU: "Перорально, путем смешивания с питьевой водой." 
  },

  species: ['bird', 'livestock', 'horse'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
მცენარეული საშუალება, რომელიც იცავს ზედა სასუნთქ გზებს და აქვს ამოსახველებელი ეფექტი ცხვირის, სინუსებისა და ტრაქეის ლორწოვან გარსებზე. 

რეკომენდებულია:
• არახელსაყრელი გარემო პირობებისას (მაღალი ტემპერატურა, დამტვერვა).
• ვაქცინაციის შემდგომი არასასურველი ეფექტების შესამსუბუქებლად.
• სასუნთქი გზების გაწმენდისა და სუნთქვის გაადვილებისთვის.

შემადგენლობა: ევკალიპტის ზეთი, პიტნის ზეთი, თიმის ზეთი, მენთოლი.

რეკომენდებული დოზირება:
• ფრინველი: 200-300 მლ / 1000 ლ სასმელ წყალზე.
• ღორები და ხბოები: 2.5-3 მლ / 10 ლ სასმელ წყალზე.
• ცხენები: 700 მლ / 1000 ლ სასმელ წყალზე.

ხელმისაწვდომი შეფუთვები: 100 მლ, 1 ლ.`,

    EN: `DIRECTIONS FOR USE:
A herbal supplement that protects the upper respiratory tract and has an expectorant effect on the mucous membranes of the nose, sinuses, and trachea.

Recommended for:
• Adverse environmental conditions (high temperature, high dust levels).
• Relieving undesirable effects after vaccination.
• Clearing respiratory tracts and easing breathing.

COMPOSITION: Eucalyptus oil, Peppermint oil, Thyme oil, Menthol.

RECOMMENDED USAGE:
• Poultry: 200-300 mL / 1000 L drinking water.
• Pigs and Calves: 2.5-3 mL / 10 L drinking water.
• Horses: 700 mL / 1000 L drinking water.

Available packaging: 100 ml, 1 L.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Растительная добавка, которая защищает верхние дыхательные пути и оказывает отхаркивающее действие на слизистые оболочки носа, пазух и трахеи.

Рекомендуется при:
• Неблагоприятных условиях окружающей среды (высокая температура, запыленность).
• Смягчении нежелательных эффектов после вакцинации.
• Очищении дыхательных путей и облегчении дыхания.

СОСТАВ: Эвкалиптовое масло, Мятное масло, Масло тимьяна, Ментол.

РЕКОМЕНДУЕМАЯ ДОЗИРОВКА:
• Птица: 200-300 мл на 1000 л питьевой воды.
• Свиньи и телята: 2,5-3 мл на 10 л питьевой воды.
• Лошади: 700 мл на 1000 л питьевой воды.

Доступные упаковки: 100 мл, 1 л.`
  }
},
  {
  id: 7,
  name: { 
    GE: "MOVE+G სახსრების მხარდაჭერა", 
    EN: "MOVE+G Joint Support", 
    RU: "MOVE+G Поддержка суставов" 
  },
  category: "pharma",
  sub: "care",
  price: 35.0, // ფასი შეგიძლიათ შეცვალოთ
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/move.jpg",
  // ძირითადი შეფუთვა (ტაბლეტები ან მცირე მოცულობა პატარა ცხოველებისთვის)
  volume: { GE: "60 ტაბლეტი / 100 მლ", EN: "60 Tablets / 100 ml", RU: "60 Таблеток / 100 мл" },
  
  purpose: { 
    GE: "სახსრებისა და ხრტილოვანი ქსოვილის დამცავი საშუალება კატებისა და ძაღლებისთვის. ზრდის მობილობას და ამცირებს ანთებას.", 
    EN: "Joint and cartilage protection for cats and dogs. Increases mobility and reduces inflammation.", 
    RU: "Средство для защиты суставов и хрящевой ткани кошек и собак. Улучшает мобильность и снимает воспаление." 
  },

  usage: { 
    GE: "პერორალურად, პირდაპირ ან საკვებში დამატებით.", 
    EN: "Orally, directly or mixed with food.", 
    RU: "Перорально, непосредственно или с кормом." 
  },

  species: ['dog', 'cat'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
MOVE+G გამოიყენება კატებისა და ძაღლების სახსრების გასამაგრებლად და ხრტილოვანი ქსოვილის სტრუქტურის დასაცავად.

ძირითადი თვისებები:
• გლუკოზამინი და ქონდროიტინი: ხელს უწყობენ სახსრების მოქნილობისა და მობილობის გაზრდას.
• MSM (მეთილსულფონილმეთანი): ცნობილია ანთების საწინააღმდეგო ეფექტით, რაც ამცირებს ტკივილს.
• ვიტამინი C: ხელს უწყობს კოლაგენის წარმოქმნას, რაც აუცილებელია ძვლებისა და ხრტილების ჯანმრთელობისთვის.
• განსაკუთრებით ეფექტურია ხანდაზმული ცხოველებისთვის დაზიანებული ქსოვილების აღსადგენად.

შემადგენლობა: გლუკოზამინის ჰიდროქლორიდი, ქონდროიტინის სულფატი, MSM, ვიტამინი C.

შენახვის პირობები: შეინახეთ კარგად დახურულ შეფუთვაში, მშრალ ადგილას ოთახის ტემპერატურაზე (25°C). დაიცავით მზის სხივებისგან.
ვარგისიანობის ვადა: 2 წელი წარმოების დღიდან.`,

    EN: `DIRECTIONS FOR USE:
MOVE+G is used to strengthen joints and protect the structure of cartilage tissue in cats and dogs.

Key Benefits:
• Glucosamine & Chondroitin: Combined intake helps increase joint flexibility and mobility.
• MSM: Known for its anti-inflammatory effects, helping to reduce pain.
• Vitamin C: Promotes collagen production, essential for cartilage and bone health.
• Recovery: Supports the repair of joint and cartilage damage in elderly pets and eliminates inflammation.

COMPOSITION: Glucosamine Hydrochloride, Chondroitin Sulfate, MSM, Vitamin C.

STORAGE: Store in a tightly closed package, in a dry place at room temperature (25°C). Protect from direct sunlight.
Shelf life: 2 years from production date.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
MOVE+G применяется для укрепления суставов и защиты структуры хрящевой ткани у кошек и собак.

Основные преимущества:
• Глюкозамин и Хондроитин: Способствуют повышению гибкости и подвижности суставов.
• МСМ (Метилсульфонилметан): Обладает противовоспалительным эффектом, помогая уменьшить боль.
• Витамин С: Способствует выработке коллагена, необходимого для здоровья хрящей и костей.
• Восстановление: Помогает восстановить поврежденные суставы и хрящи у пожилых кошек и собак.

СОСТАВ: Глюкозамина гидрохлорид, Хондроитина сульфат, МСМ, Витамин С.

УСЛОВИЯ ХРАНЕНИЯ: Хранить в плотно закрытой упаковке в сухом месте при комнатной температуре (25°C). Беречь от солнечных лучей.
Срок годности: 2 года с даты производства.`
  }
},
  {
  id: 8,
  name: { 
    GE: "თმის ბურთულების საწინააღმდეგო ალაოს პასტა", 
    EN: "Anti-Hairball Malt Paste", 
    RU: "Мальт-паста против комочков шерсти" 
  },
  category: "pharma",
  sub: "care",
  price: 28.0, // ფასი შეგიძლიათ შეცვალოთ
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/anti-hairball.jpg",
  volume: { GE: "100 გრ", EN: "100 g", RU: "100 гр" },
  
  purpose: { 
    GE: "ხელს უწყობს კატის ორგანიზმიდან ბეწვის ბურთულების გამოდევნას, აუმჯობესებს ნაწლავების მიკროფლორას და აძლიერებს იმუნიტეტს.", 
    EN: "Helps eliminate hairballs from the cat's body, improves intestinal microflora, and strengthens the immune system.", 
    RU: "Способствует выведению комков шерсти из организма кошки, улучшает микрофлору кишечника и укрепляет иммунитет." 
  },

  usage: { 
    GE: "პერორალურად, თათზე დატანით ან საკვებთან ერთად.", 
    EN: "Orally, by applying to the paw or mixing with food.", 
    RU: "Перорально, путем нанесения на лапу или с кормом." 
  },

  species: ['cat'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
ალაოს პასტა ეხმარება კატებს ბეწვისა და სხვა ძნელად მოსანელებელი კომპონენტების ორგანიზმიდან უსაფრთხოდ გამოდევნაში.

ძირითადი თვისებები:
• ბეწვის ბურთულების მოცილება: ხელს უწყობს საჭმლის მომნელებელ სისტემაში დაგროვილი ბეწვის გამოდევნას.
• MOS (მანანის ოლიგოსაქარიდი): აუმჯობესებს ნაწლავების ჯანმრთელობას და ამცირებს მავნე მიკროორგანიზმების ზემოქმედებას.
• ბეტა-გლუკანი: აძლიერებს იმუნურ სისტემას და ზრდის ორგანიზმის საერთო წინააღმდეგობას.
• ბოჭკოვანი შემადგენლობა: აკმაყოფილებს კატის საჭიროებას ბოჭკოზე ნაწლავების გამართული ფუნქციონირებისთვის.

გამოყენების ინსტრუქცია:
• ზრდასრული კატები: 1.5 გ (დაახლ. 3 სმ).
• კნუტები: 0.5 გ (დაახლ. 1 სმ).
• პრევენციისთვის: კვირაში 2-3-ჯერ.
• აქტიური ბეწვის ბურთულებისას: ყოველდღიურად.
რჩევა: დაიდეთ თათების წინა მხარეს, რათა კატამ შეძლოს მისი ალოკვა.

შენახვის პირობები: შეინახეთ მშრალ, სუფთა ადგილას ოთახის ტემპერატურაზე (25°C). დაიცავით მზის პირდაპირი სხივებისგან.
ვარგისიანობის ვადა: 2 წელი წარმოების დღიდან.`,

    EN: `DIRECTIONS FOR USE:
Malt Paste helps cats safely eliminate hair and other indigestible components from their body.

Key Benefits:
• Hairball Removal: Facilitates the removal of accumulated hairballs from the digestive tract.
• MOS (Mannan-oligosaccharide): Supports natural digestive balance and improves intestinal health.
• Beta-Glucan: Strengthens the immune system and increases general health resistance.
• High Fiber: Meets the cat's fiber needs for smooth intestinal functioning.

Instructions:
• Adult Cats: 1.5 g (approx. 3 cm).
• Kittens: 0.5 g (approx. 1 cm).
• For Prevention: 2-3 times per week.
• For Active Hairballs: Daily.
Tip: Apply to the front of the paws so the cat can lick it off.

STORAGE: Store in a dry place at room temperature (25°C). Protect from direct sunlight.
Shelf life: 2 years from production date.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Мальт-паста помогает кошкам безопасно выводить шерсть и другие трудноперевариваемые компоненты из организма.

Основные преимущества:
• Выведение шерсти: Облегчает удаление скопившихся комочков шерсти из пищеварительной системы.
• МОС (Маннаноолигосахариды): Поддерживает баланс пищеварительной системы и здоровье кишечника.
• Бета-глюкан: Укрепляет иммунную систему и повышает общую сопротивляемость организма.
• Клетчатка: Обеспечивает потребность кошки в клетчатке для правильной работы кишечника.

Инструкция:
• Взрослые кошки: 1,5 г (около 3 см).
• Котята: 0,5 г (около 1 см).
• Для профилактики: 2-3 раза в неделю.
• При наличии комков шерсти: Ежедневно.
Совет: Нанесите на переднюю часть лап, чтобы кошка могла слизать пасту.

УСЛОВИЯ ХРАНЕНИЯ: Хранить в сухом месте при комнатной температуре (25°C). Беречь от солнечных лучей.
Срок годности: 2 года с даты производства.`
  }
},

  // --- ახალი პროდუქტები (ცხოველთა კვება) ---
  {
  id: 9,
  name: { 
    GE: "დამამშვიდებელი პასტა კატებისა და ძაღლებისთვის", 
    EN: "Calming Paste for Cats and Dogs", 
    RU: "Успокаивающая паста для кошек и собак" 
  },
  category: "pharma",
  sub: "care",
  price: 28.0, // ფასი შეგიძლიათ შეცვალოთ
  manufacturer: "Mistav",
  exporter: "VMN Pharmaceuticals",
  image: "/images/calming.jpg",
  volume: { GE: "100 გრ", EN: "100 g", RU: "100 гр" },
  
  purpose: { 
    GE: "სტრესისა და შფოთვის შესამსუბუქებელი საშუალება. გამოიყენება მგზავრობის, ვეტერინართან ვიზიტისა და აგრესიული ქცევის დროს.", 
    EN: "A remedy to relieve stress and anxiety. Used during travel, vet visits, and for aggressive behavior.", 
    RU: "Средство для снятия стресса и беспокойства. Используется при поездках, визитах к ветеринару и агрессивном поведении." 
  },

  usage: { 
    GE: "პერორალურად, პირდაპირ ტუბიდან, საკვებში შერევით ან თათზე დატანით.", 
    EN: "Orally, directly from the tube, mixed with food, or applied to the paw.", 
    RU: "Перорально, прямо из тюбика, смешивая с кормом или нанося на лапу." 
  },

  species: ['dog', 'cat'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
შექმნილია კატებისა და ძაღლებისთვის სტრესისა და ქცევითი დარღვევების კონტროლისთვის, დაბალანსებული ქცევის ხელშესაწყობად.

რეკომენდებულია შემდეგ სიტუაციებში:
• ნერვული ან აგრესიული ქცევა.
• მგზავრობა და ტრანსპორტირება.
• ვეტერინართან ვიზიტები და გარემოს შეცვლა.
• ხმაურისგან (ფოიერვერკები და ა.შ.) გამოწვეული შფოთვა.

შემადგენლობა:
ჩაის ხის, ვალერიანის ფესვისა და გვირილის ექსტრაქტები — უზრუნველყოფს ბუნებრივ დამამშვიდებელ ეფექტს და ამცირებს სტრესის დონეს.

გამოყენების ინსტრუქცია:
• ზრდასრული კატები და ძაღლები: 4 სმ (2 გ) დღეში.
• საჭიროების შემთხვევაში, დღიური რაოდენობა შეიძლება გაორმაგდეს.
• მიცემის წესი: წაისვით პირდაპირ ტუბიდან, შეურიეთ საკვებს ან დაიდეთ თათზე, რათა ცხოველმა შეძლოს მისი ალოკვა.

შენახვის პირობები: შეინახეთ კარგად დახურულ შეფუთვაში, მშრალ ადგილას ოთახის ტემპერატურაზე (25°C). დაიცავით მზის პირდაპირი სხივებისგან.
ვარგისიანობის ვადა: 2 წელი წარმოების დღიდან.`,

    EN: `DIRECTIONS FOR USE:
Designed for cats and dogs to control stress and behavioral disorders and promote balanced behavior.

Recommended in the following situations:
• Nervous or aggressive behavior.
• Travel and transportation.
• Veterinary visits and changes in environment.
• Anxiety caused by noise (fireworks, etc.).

COMPOSITION:
Tea tree, Valerian root, and Chamomile extracts — provide a natural calming effect and help reduce stress levels.

Instructions:
• Adult Cats and Dogs: 4 cm (2 g) per day.
• If necessary, the daily amount can be doubled.
• Administration: Apply directly from the tube, mix with food, or apply to the paw so the pet can lick it off.

STORAGE: Store in a tightly closed package, in a dry place at room temperature (25°C). Protect from direct sunlight.
Shelf life: 2 years from production date.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
Разработано для кошек и собак для контроля стресса, поведенческих расстройств и поддержания сбалансированного поведения.

Рекомендуется в следующих ситуациях:
• Нервное или агрессивное поведение.
• Путешествия и транспортировка.
• Визиты к ветеринару и смена обстановки.
• Беспокойство, вызванное шумом (фейерверки и т. д.).

СОСТАВ:
Экстракты чайного дерева, корня валерианы и ромашки — обеспечивают естественный успокаивающий эффект и помогают снизить уровень стресса.

Инструкция:
• Взрослые кошки и собаки: 4 см (2 г) в день.
• При необходимости суточную дозу можно удвоить.
• Способ применения: Нанесите прямо из тюбика, смешайте с кормом или нанесите на лапу, чтобы питомец мог слизать пасту.

УСЛОВИЯ ХРАНЕНИЯ: Хранить в плотно закрытой упаковке, в сухом месте при комнатной температуре (25°C). Беречь от солнечных лучей.
Срок годности: 2 года с даты производства.`
  }
},
  {
  id: 10,
  name: { 
    GE: "TYLOGENTA PLUS საინექციო ხსნარი", 
    EN: "TYLOGENTA PLUS Injectable Solution", 
    RU: "TYLOGENTA PLUS Раствор для инъекций" 
  },
  category: "pharma",
  sub: "antibiotic",
  price: 30.0, // ფასი შეგიძლიათ შეცვალოთ
  manufacturer: "NAPHAVET (GMP-WHO)",
  exporter: "VMN Pharmaceuticals",
  image: "/images/tylogenta_plus.jpg",
  // ძირითადი მოცულობა - 100 მლ
  volume: { GE: "100 მლ", EN: "100 ml", RU: "100 мл" },
  
  purpose: { 
    GE: "კომბინირებული ანტიბიოტიკი, სიცხის დამწევი და ტკივილგამაყუჩებელი საშუალება. გამოიყენება რესპირატორული და საჭმლის მომნელებელი სისტემის ინფექციების სამკურნალოდ.", 
    EN: "Combined antibiotic, antipyretic, and analgesic. Used for the treatment of respiratory and digestive system infections.", 
    RU: "Комбинированный антибиотик, жаропонижающее и болеутоляющее средство. Применяется для лечения инфекций дыхательных путей и пищеварительной системы." 
  },

  usage: { 
    GE: "საინექციო საშუალება (კუნთში შეყვანით).", 
    EN: "Injectable (Intramuscular administration).", 
    RU: "Инъекционный препарат (внутримышечное введение)." 
  },

  species: ['bird', 'livestock'],

  fullDetails: { 
    GE: `გამოყენების ჩვენებები:
TYLOGENTA PLUS არის სწრაფად აბსორბირებადი ბაქტერიოსტატიკური საშუალება. გამოიყენება შემდეგი დაავადებების სამკურნალოდ:

მსხვილფეხა რქოსანი პირუტყვი, ცხვარი და თხა:
• პნევმონია და რესპირატორული დაავადებები.
• დიფტერია და მეტრიტი.
• მიკოპლაზმით გამოწვეული ინფექციები.

ღორი:
• წითელი ქარი (Erysipelas).
• მიკოპლაზმური ართრიტი.
• სალმონელოზი და ენტერიტი.

ფრინველი:
• ქრონიკული რესპირატორული დაავადებები (CRD).
• გრამ-დადებითი და გრამ-უარყოფითი ბაქტერიებით გამოწვეული ინფექციები.

შემადგენლობა (1 მლ-ზე):
• ტაილოზინის ტარტრატი — 200 მგ
• გენტამიცინის სულფატი — 80 მგ
• ნატრიუმის დიპირონი — 250 მგ

თვისებები: შეიცავს დიპირონს, რომელიც ეხმარება ანტიბიოტიკის უკეთ ათვისებას და ამცირებს ქსოვილების შეშუპებას.`,

    EN: `DIRECTIONS FOR USE:
TYLOGENTA PLUS is a rapidly absorbed bacteriostatic agent. It is recommended for the treatment of:

Cattle, Sheep, and Goats:
• Pneumonia and chronic respiratory diseases.
• Diphtheria and metritis.
• Infections caused by Mycoplasma.

Swine (Pigs):
• Erysipelas attacks.
• Arthritis caused by Mycoplasma.
• Salmonellosis and cases of enteritis.

Poultry:
• Chronic respiratory diseases and other infections caused by Mycoplasma.
• Gram-positive and some Gram-negative bacteria.

COMPOSITION (per 1 ml):
• Tylosin tartrate — 200 mg
• Gentamycin sulphate — 80 mg
• Sodium dipyrone — 250 mg

Features: Contains dipyrone, which helps the antibiotic be absorbed better and reduces tissue swelling at the injection site.`,

    RU: `ПОКАЗАНИЯ К ПРИМЕНЕНИЮ:
TYLOGENTA PLUS — быстро всасывающееся бактериостатическое средство. Рекомендуется для лечения:

Крупный рогатый скот, овцы и козы:
• Пневмония и хронические респираторные заболевания.
• Дифтерия и метрит.
• Инфекции, вызванные микоплазмой.

Свиньи:
• Рожистое воспаление свиней (Erysipelas).
• Артрит, вызванный микоплазмой.
• Сальмонеллез и энтерит.

Птица:
• Хронические респираторные заболевания (CRD).
• Инфекции, вызванные грамположительными и некоторыми грамотрицательными бактериями.

СОСТАВ (на 1 мл):
• Тилозина тартрат — 200 мг
• Гентамицина сульфат — 80 мг
• Натрия дипирон — 250 мг

Особенности: Содержит дипирон, который способствует лучшему всасыванию антибиотика и уменьшает отек тканей в месте инъекции.`
  }
},
  { 
    id: 12, 
    name: { GE: "Omega 3-6 Oil", EN: "Omega 3-6 Oil", RU: "Омега 3-6 Масло" }, 
    category: "nutrition", sub: "supplement", price: 32.0, manufacturer: "BioVet", 
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400",
    volume: { GE: "250 მლ", EN: "250 ml", RU: "250 мл" },
    purpose: { GE: "ბეწვისა და კანის ჯანმრთელობისთვის.", EN: "For coat and skin health.", RU: "Для здоровья шерсти и кожи." },
    usage: { GE: "დაამატეთ საკვებში.", EN: "Add to food.", RU: "Добавлять в корм." }
  },
  { 
    id: 13, 
    name: { GE: "Senior Cat Mix", EN: "Senior Cat Mix", RU: "Сеньор Кот Микс" }, 
    category: "nutrition", sub: "dry_food", price: 55.0, manufacturer: "NatureFeed", 
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=400",
    volume: { GE: "3 კგ", EN: "3 kg", RU: "3 кг" },
    purpose: { GE: "ხანდაზმული კატების კვება.", EN: "Nutrition for senior cats.", RU: "Питание для пожилых кошек." },
    usage: { GE: "თავისუფალი წვდომა საკვებთან.", EN: "Free access to food.", RU: "Свободный доступ к корму." }
  },
  { 
    id: 14, 
    name: { GE: "კალციუმი + D3", EN: "Calcium + D3", RU: "Кальций + D3" }, 
    category: "nutrition", sub: "supplement", price: 25.0, manufacturer: "HealthPet", 
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
    volume: { GE: "100 აბი", EN: "100 tabs", RU: "100 таб" },
    purpose: { GE: "ძვლოვანი სისტემის გაძლიერება.", EN: "Strengthening the skeletal system.", RU: "Укрепление костной системы." },
    usage: { GE: "ყოველდღიურად საკვებთან ერთად.", EN: "Daily with food.", RU: "Ежедневно во время еды." }
  },
  { 
    id: 15, 
    name: { GE: "Hypoallergenic Dog", EN: "Hypoallergenic Dog", RU: "Гипоаллергенная собака" }, 
    category: "nutrition", sub: "dry_food", price: 130.0, manufacturer: "NatureFeed", 
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400",
    volume: { GE: "12 კგ", EN: "12 kg", RU: "12 кг" },
    purpose: { GE: "ალერგიული ძაღლებისთვის.", EN: "For allergic dogs.", RU: "Для собак с аллергией." },
    usage: { GE: "მხოლოდ მშრალი სახით.", EN: "Dry use only.", RU: "Только в сухом виде." }
  },
  { 
    id: 16, 
    name: { GE: "მულტივიტამინური სიროფი", EN: "Multivitamin Syrup", RU: "Мультивитаминный сироп" }, 
    category: "pharma", sub: "vitamin", price: 29.0, manufacturer: "VetiCare", 
    image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=400",
    volume: { GE: "200 მლ", EN: "200 ml", RU: "200 мл" },
    purpose: { GE: "იმუნიტეტის ასამაღლებლად.", EN: "To boost immunity.", RU: "Для повышения иммунитета." },
    usage: { GE: "პერორალურად (პირიდან).", EN: "Orally.", RU: "Перорально." }
  },
  { 
    id: 17, 
    name: { GE: "ენერჯი პასტა", EN: "Energy Paste", RU: "Энергетическая паста" }, 
    category: "nutrition", sub: "supplement", price: 38.0, manufacturer: "BioVet", 
    image: "https://images.unsplash.com/photo-1611928482473-7b27d24eab80?q=80&w=400",
    volume: { GE: "100 გრ", EN: "100 g", RU: "100 г" },
    purpose: { GE: "აღდგენითი პერიოდისთვის.", EN: "For the recovery period.", RU: "Для восстановительного периода." },
    usage: { GE: "მიეცით პირდაპირ პირიდან.", EN: "Give directly by mouth.", RU: "Давать прямо в рот." }
  },
  { 
    id: 18, 
    name: { GE: "Betadine Vet Solution", EN: "Betadine Vet Solution", RU: "Бетадин Вет Раствор" }, 
    category: "pharma", sub: "parasite", price: 14.0, manufacturer: "PharmVet", 
    image: "https://plus.unsplash.com/premium_photo-1663045973501-11910620f4f9?q=80&w=400",
    volume: { GE: "100 მლ", EN: "100 ml", RU: "100 мл" },
    purpose: { GE: "ჭრილობების დასამუშავებლად.", EN: "For wound treatment.", RU: "Для обработки ран." },
    usage: { GE: "გარეგანი გამოყენებისთვის.", EN: "For external use.", RU: "Для наружного применения." }
  }
];