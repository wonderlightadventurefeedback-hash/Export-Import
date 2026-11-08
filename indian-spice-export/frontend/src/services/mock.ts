import {
  Product,
  SpiceCategory,
  WholesaleService,
  ExportProcessStep,
  FAQItem,
} from "../types";

export const MOCK_CATEGORIES: SpiceCategory[] = [
  {
    id: "cat-1",
    name: "Turmeric",
    slug: "turmeric",
    tagline: "High-Curcumin Roots & Pure Ground Form",
    description:
      "Sourced from the fertile, bio-rich soil of Kandhamal (Odisha) and renowned Indian turmeric belts, noted for intense natural aroma and high curcumin levels.",
    heroImage:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80",
    itemCount: 4,
    featuredOrder: 1,
  },
  {
    id: "cat-2",
    name: "Red Chilli",
    slug: "red-chilli",
    tagline: "Vibrant Colour & Controlled Pungency Grades",
    description:
      "Selected whole dried chillies and fine powders ranging from high-pungency Teja to deep-red low-heat Byadgi and Kashmiri varieties.",
    heroImage:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
    itemCount: 4,
    featuredOrder: 2,
  },
  {
    id: "cat-3",
    name: "Black Pepper",
    slug: "black-pepper",
    tagline: "The King of Spices from the Malabar Coast & Eastern Ghats",
    description:
      "Bold, sun-dried black peppercorns offering high piperine density, robust essential oils, and clean garbled grades.",
    heroImage:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    itemCount: 3,
    featuredOrder: 3,
  },
  {
    id: "cat-4",
    name: "Green Cardamom",
    slug: "green-cardamom",
    tagline: "Fragrant Queen of Spices, Hand-Sorted Pods",
    description:
      "Extra bold 8mm+ and bold 7-8mm deep green pods harvested from misty hill plantations with sealed aroma and high oil retention.",
    heroImage:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
    itemCount: 3,
    featuredOrder: 4,
  },
  {
    id: "cat-5",
    name: "Cumin Seeds",
    slug: "cumin-seeds",
    tagline: "Earthy, Warm & High Essential Oil Content",
    description:
      "Machine-cleaned and sortex-sorted cumin seeds with high volatile oil value, machine cleaned 99% and 99.5% purity.",
    heroImage:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
    itemCount: 2,
    featuredOrder: 5,
  },
  {
    id: "cat-6",
    name: "Coriander Seeds",
    slug: "coriander-seeds",
    tagline: "Citrusy, Golden-Green Aromatic Seeds",
    description:
      "Eagle and Scooter quality whole seeds and steam-sterilised powders suited for food industrial processing and seasoning blends.",
    heroImage:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
    itemCount: 2,
    featuredOrder: 6,
  },
  {
    id: "cat-7",
    name: "Cinnamon & Cassia",
    slug: "cinnamon",
    tagline: "Sweetly Fragrant Quills & Clean Bark Splits",
    description:
      "Graded Ceylon-type cinnamon quills and rich Cassia bark rolls, prized for confectionery, beverage distilling, and baking.",
    heroImage:
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1200&q=80",
    itemCount: 2,
    featuredOrder: 7,
  },
  {
    id: "cat-8",
    name: "Cloves",
    slug: "cloves",
    tagline: "Hand-Picked Buds Rich in Eugenol",
    description:
      "Selected whole flower buds with intact head caps and rich reddish-brown color, harvested with strict moisture monitoring.",
    heroImage:
      "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1200&q=80",
    itemCount: 2,
    featuredOrder: 8,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-turmeric-fingers",
    name: "Kandhamal Organic Turmeric Fingers",
    scientificName: "Curcuma longa",
    slug: "kandhamal-turmeric-fingers",
    categorySlug: "turmeric",
    categoryName: "Turmeric",
    headline: "GI-tagged high curcumin turmeric fingers sourced from indigenous tribal farmers in Odisha.",
    description:
      "Grown naturally without synthetic inputs in the highlands of Kandhamal, Odisha. Known for its intense golden hue, strong balsamic fragrance, and naturally elevated curcumin concentration.",
    detailedDescription:
      "Kandhamal Turmeric is traditionally cultivated in the hill tracts of Odisha. The unique agro-climatic conditions and traditional sun-curing give these turmeric fingers a hard core, deep yellow-orange interior, and superior volatile oil composition suitable for both food extraction and nutraceutical applications.",
    availableForms: ["whole", "ground"],
    originState: "Odisha",
    sourcingBelt: "Kandhamal District, Eastern Ghats",
    harvestSeason: "January - March",
    specifications: {
      curcuminContent: "4.5% - 5.5% (HPLC tested)",
      moistureMax: "10.0%",
      totalAshMax: "7.0%",
      extraneousMatterMax: "0.5%",
      acidInsolubleAshMax: "1.0%",
      appearance: "Well-cured whole fingers, deep yellow interior",
      aroma: "Pungent, warm, earthy and musky",
    },
    grades: ["Hand Picked Selected (HPS)", "Grade A Polished", "Unpolished Raw"],
    packagingOptions: [
      {
        type: "New Jute Bags with inner Food-grade PP liner",
        sizes: ["25 kg", "50 kg"],
        innerLiner: "Polythene liner 50 micron",
        palletsAvailable: true,
      },
      {
        type: "Multiwall Kraft Paper Bags",
        sizes: ["20 kg", "25 kg"],
        innerLiner: "Moisture-barrier foil layer",
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request (Standard bulk minimum 1 Metric Tonne)",
    images: [
      {
        url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80",
        alt: "Kandhamal turmeric fingers and powder in traditional bowls",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80",
        alt: "Cured whole spice selection",
      },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "prod-turmeric-powder",
    name: "Pure Ground Turmeric Powder (Food Grade)",
    scientificName: "Curcuma longa",
    slug: "pure-ground-turmeric-powder",
    categorySlug: "turmeric",
    categoryName: "Turmeric",
    headline: "Micro-pulverized golden turmeric powder with zero fillers, starches, or artificial colorants.",
    description:
      "Manufactured from thoroughly cleaned and de-stoned polished turmeric fingers using cold hammer milling to preserve delicate volatile aromatics and color pigments.",
    detailedDescription:
      "Our ground turmeric undergoes strict metal detection, sieving through 80 to 100 mesh, and microbiological checks. Steam-sterilised lots are prepared upon request to conform with strict EU and US FDA import limits.",
    availableForms: ["ground"],
    originState: "Odisha / Andhra Pradesh",
    sourcingBelt: "Eastern Agricultural Zone",
    specifications: {
      curcuminContent: "3.0% - 5.0% by weight",
      moistureMax: "10.0%",
      granulation: "95% passes through 80 mesh",
      totalAshMax: "7.0%",
      acidInsolubleAshMax: "1.0%",
      bulkDensity: "0.55 - 0.65 g/ml",
    },
    grades: ["Premium Culinary 4.5% Curcumin", "Standard Grade 3.0% Curcumin"],
    packagingOptions: [
      {
        type: "Heavy Duty Multiwall Paper Bags",
        sizes: ["20 kg", "25 kg"],
        innerLiner: "Heat-sealed polyethylene",
        palletsAvailable: true,
      },
      {
        type: "Vacuum Sealed Foil Bags in Master Cartons",
        sizes: ["10 kg", "20 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80",
        alt: "Golden ground turmeric powder",
        isPrimary: true,
      },
    ],
    isFeatured: false,
    status: "published",
  },
  {
    id: "prod-malabar-black-pepper",
    name: "Tellicherry / Malabar Garbled Black Pepper",
    scientificName: "Piper nigrum",
    slug: "malabar-garbled-black-pepper",
    categorySlug: "black-pepper",
    categoryName: "Black Pepper",
    headline: "Bold, sun-dried Tellicherry Extra Bold (TGSEB) and Garbled Malabar peppercorns.",
    description:
      "Naturally harvested berries sundried on clean mats to achieve an intense dark wrinkled berry shell with full volatile oil retention.",
    detailedDescription:
      "Grown in shade canopy soils across southern India and the coastal regions. Handled through pneumatic density separators and spiral gravity cleaners to remove pinheads and light berries.",
    availableForms: ["whole", "crushed", "ground"],
    originState: "Kerala / Odisha",
    sourcingBelt: "Western Ghats & Koraput Highlands",
    specifications: {
      piperineContent: "4.5% - 6.0%",
      volatileOilMin: "2.0% - 3.5% v/w",
      moistureMax: "11.5%",
      bulkDensity: "550 g/L - 600 g/L (TGSEB)",
      extraneousMatterMax: "0.2%",
    },
    grades: ["TGSEB (Tellicherry Garbled Special Extra Bold)", "TGL (Tellicherry Garbled)", "MG-1 (Malabar Garbled)"],
    packagingOptions: [
      {
        type: "Double-walled PP Woven Bags",
        sizes: ["25 kg", "50 kg"],
        innerLiner: "Moisture seal liner",
        palletsAvailable: true,
      },
      {
        type: "Jute bags with inner poly lining",
        sizes: ["50 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
        alt: "Garbled black peppercorns heap",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "prod-guntur-s4-chilli",
    name: "Guntur Snam S4 Red Chilli (Stemless / With Stem)",
    scientificName: "Capsicum annuum",
    slug: "guntur-snam-s4-red-chilli",
    categorySlug: "red-chilli",
    categoryName: "Red Chilli",
    headline: "World-famous Guntur S4 chilli featuring fiery heat and rich natural red color.",
    description:
      "Carefully graded whole dry pods with thick skins, high capsaicin content, and superior seed density for industrial spice blending and oleoresin extraction.",
    detailedDescription:
      "Directly sourced from verified grower clusters in Guntur. Pods are shade-dried and cold-stored immediately after curing to preserve the deep red ASTA color value.",
    availableForms: ["whole", "crushed", "ground"],
    originState: "Andhra Pradesh",
    sourcingBelt: "Guntur Chilli Belt",
    specifications: {
      capsaicinSHU: "35,000 - 45,000 SHU",
      astaColorValue: "50 - 70 ASTA",
      moistureMax: "10.0%",
      looseSeedsMax: "2.0%",
      brokenChillisMax: "3.0%",
    },
    grades: ["Stemless Grade A", "Stem Cut Grade A", "Standard with Stem"],
    packagingOptions: [
      {
        type: "Baled Jute Sacks (Machine Compressed)",
        sizes: ["25 kg", "30 kg", "40 kg"],
        palletsAvailable: false,
      },
      {
        type: "Carton Packing with inner liner",
        sizes: ["10 kg", "15 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
        alt: "Vibrant dried red chillies with stem",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "prod-green-cardamom-bold",
    name: "Alleppey Green Cardamom (8mm+ Extra Bold)",
    scientificName: "Elettaria cardamomum",
    slug: "alleppey-green-cardamom-extra-bold",
    categorySlug: "green-cardamom",
    categoryName: "Green Cardamom",
    headline: "Hand-sorted deep green pods with high essential oil value and sealed aroma.",
    description:
      "Picked at peak maturity from hillside micro-farms, cured in gentle wood-fire or electric kilns to preserve natural chlorophyll, and calibrated by pod diameter.",
    detailedDescription:
      "Every lot is passed through mechanical sizing sieves to separate 8mm+, 7.5mm, and 7mm fractions. Packaged in vacuum-sealed food grade pouches to preserve the delicate aroma during maritime transport.",
    availableForms: ["whole", "ground"],
    originState: "Kerala",
    sourcingBelt: "Idukki & Cardamom Hills",
    specifications: {
      volatileOilMin: "7.0% - 9.0% v/w",
      moistureMax: "11.0%",
      podDiameter: "8.0 mm and above",
      emptyImmaturePodsMax: "1.0%",
      color: "Deep olive to emerald green",
    },
    grades: ["AGEB (Alleppey Green Extra Bold - 8mm+)", "AGB (Alleppey Green Bold - 7.5-8mm)", "AGS (Alleppey Green Superior - 7-7.5mm)"],
    packagingOptions: [
      {
        type: "Vacuum-sealed Multi-ply Foil Pouches in Master Cartons",
        sizes: ["5 kg x 2 pouches (10 kg box)", "5 kg x 4 pouches (20 kg box)"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
        alt: "Green cardamom pods in wooden spoon",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "prod-unjha-cumin-seeds",
    name: "Machine Cleaned & Sortex Cumin Seeds (Jeera)",
    scientificName: "Cuminum cyminum",
    slug: "unjha-cumin-seeds-sortex",
    categorySlug: "cumin-seeds",
    categoryName: "Cumin Seeds",
    headline: "99.5% purity Sortex cleaned cumin seeds with rich thymol and essential aromatics.",
    description:
      "Grown in arid, mineral-rich soils and processed in modern processing plants equipped with optical sortex cameras to remove all discoloration and foreign matter.",
    detailedDescription:
      "High natural volatile oil content makes this cumin suitable for distillation, oleoresin manufacturing, ground blends, and culinary repackaging worldwide.",
    availableForms: ["whole", "ground"],
    originState: "Gujarat / Rajasthan",
    sourcingBelt: "Unjha Sourcing Belt",
    specifications: {
      purity: "99.0% - 99.5% (Sortex Cleaned)",
      volatileOilMin: "2.5% - 3.2% v/w",
      moistureMax: "9.0%",
      totalAshMax: "8.0%",
      acidInsolubleAshMax: "1.0%",
    },
    grades: ["Singapore Quality 99% Sortex", "Europe Quality 99.5% Sortex", "Standard Commercial Cleaned"],
    packagingOptions: [
      {
        type: "PP Woven Bags with Inner Liner",
        sizes: ["25 kg", "50 kg"],
        palletsAvailable: true,
      },
      {
        type: "Multiwall Kraft Paper Bags",
        sizes: ["25 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
        alt: "Aromatic whole cumin seeds",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "prod-coriander-seeds-eagle",
    name: "Eagle Grade Coriander Seeds (Dhania)",
    scientificName: "Coriandrum sativum",
    slug: "eagle-grade-coriander-seeds",
    categorySlug: "coriander-seeds",
    categoryName: "Coriander Seeds",
    headline: "Sun-ripened, golden greenish-brown coriander seeds with crisp citrus notes.",
    description:
      "Carefully de-stoned and aspiration-cleaned coriander whole seeds with uniform kernel size and high linalool profile.",
    detailedDescription:
      "Available both as whole round seeds and split seeds (dhania dal) for roasting, ground curry blends, and pickling spice packs.",
    availableForms: ["whole", "crushed", "ground"],
    originState: "Rajasthan / Madhya Pradesh",
    sourcingBelt: "Kota & Ramganj Mandi Belt",
    specifications: {
      purity: "98.5% - 99.0%",
      volatileOilMin: "0.3% - 0.5% v/w",
      moistureMax: "9.0%",
      splitsMax: "5.0%",
      damagedSeedsMax: "1.5%",
    },
    grades: ["Eagle Quality", "Scooter Quality", "Badami Quality"],
    packagingOptions: [
      {
        type: "PP Bags with inner LDPE liner",
        sizes: ["25 kg", "40 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
        alt: "Whole coriander seeds",
        isPrimary: true,
      },
    ],
    isFeatured: false,
    status: "published",
  },
  {
    id: "prod-ceylon-cinnamon-quills",
    name: "Graded Cinnamon Quills & Cassia Bark",
    scientificName: "Cinnamomum verum",
    slug: "cinnamon-quills-and-cassia-bark",
    categorySlug: "cinnamon",
    categoryName: "Cinnamon",
    headline: "Sweet, fragrant curled cinnamon quills and thick cassia splits for premium export.",
    description:
      "Hand-peeled, tightly rolled inner bark naturally air dried. Rich in cinnamaldehyde with delicate sweet aromatic profiles.",
    detailedDescription:
      "Inspected for uniform quill diameter, free from mold or insect damage, packed with moisture protection for extended sea freight shelf life.",
    availableForms: ["whole", "ground"],
    originState: "Kerala / Tamil Nadu",
    sourcingBelt: "South-Western Plantation Belts",
    specifications: {
      moistureMax: "12.0%",
      volatileOilMin: "1.2% - 2.0% v/w",
      extraneousMatterMax: "0.5%",
      quillLength: "8 cm - 15 cm (Custom cuts available)",
    },
    grades: ["Alba / Continental Quills", "Mexican Cut", "Cassia Whole Bark Splits"],
    packagingOptions: [
      {
        type: "Carton boxes with internal barrier wrap",
        sizes: ["10 kg", "20 kg", "25 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1200&q=80",
        alt: "Cinnamon bark sticks stacked",
        isPrimary: true,
      },
    ],
    isFeatured: false,
    status: "published",
  },
  {
    id: "prod-whole-cloves-hand-picked",
    name: "Hand-Picked Whole Cloves (Lal Pari)",
    scientificName: "Syzygium aromaticum",
    slug: "hand-picked-whole-cloves",
    categorySlug: "cloves",
    categoryName: "Cloves",
    headline: "Deep reddish-brown whole flower buds with intact heads and high eugenol oil content.",
    description:
      "Picked just before flower opening and sundried under covered sheds to prevent essential oil dissipation.",
    detailedDescription:
      "Hand-sorted to ensure intact flower crowns, zero headless cloves, minimal stems, and exceptional pungency for distillation and culinary use.",
    availableForms: ["whole", "ground"],
    originState: "Tamil Nadu / Kerala",
    sourcingBelt: "Nilgiri & Kanyakumari Foothills",
    specifications: {
      eugenolContent: "15% - 20% in essential oil",
      volatileOilMin: "16.0% - 19.0% v/w",
      moistureMax: "11.0%",
      headlessClovesMax: "2.0%",
      stemsAndMotherClovesMax: "1.0%",
    },
    grades: ["Hand Picked Selected (Lal Pari)", "Grade 1 Commercial"],
    packagingOptions: [
      {
        type: "Corrugated Export Master Cartons with Heavy Poly Liner",
        sizes: ["10 kg", "25 kg"],
        palletsAvailable: true,
      },
    ],
    minOrderQuantity: "Available on request",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1200&q=80",
        alt: "High-grade whole cloves with intact crowns",
        isPrimary: true,
      },
    ],
    isFeatured: false,
    status: "published",
  },
];

export const MOCK_WHOLESALE_SERVICES: WholesaleService[] = [
  {
    id: "serv-1",
    number: "01",
    title: "Bulk Sea Container Supply",
    subtitle: "Full & Partial Container Loads (FCL / LCL)",
    description:
      "We pack and ship whole and ground spices in strong 25kg or 50kg bags. Perfect for food manufacturers, wholesalers, and packing companies worldwide.",
    features: [
      "20ft and 40ft containers loaded at major Indian ports",
      "Strong moisture barriers and desiccants in all containers",
      "Lab testing and quality check before shipping",
      "Safe wooden or plastic pallet loading",
    ],
    iconName: "Container",
  },
  {
    id: "serv-2",
    number: "02",
    title: "Custom Packaging Sizes",
    subtitle: "From Small Pouches to Bulk Bags",
    description:
      "We pack your spices to match your exact warehouse and retail requirements, from 5kg sealed foil pouches to 1,000kg bulk tote bags.",
    features: [
      "5kg, 10kg, 20kg, 25kg, and 50kg bags",
      "Sealed foil pouches to protect natural aroma",
      "Your language labels, barcodes, and logos",
      "Food-grade safe liners meeting global rules",
    ],
    iconName: "PackageCheck",
  },
  {
    id: "serv-3",
    number: "03",
    title: "Private Label & Custom Grinding",
    subtitle: "Packed Under Your Own Brand Name",
    description:
      "We clean, grind, and package spices in retail-ready bags with your company branding, logos, and custom spice blend recipes.",
    features: [
      "Custom grinding from coarse flakes to fine powders",
      "Steam cleaning to keep spices pure and fresh",
      "Safe, clean processing with zero contamination",
      "Custom spice blends and private branding",
    ],
    iconName: "Tags",
  },
  {
    id: "serv-4",
    number: "04",
    title: "Complete Export Documentation",
    subtitle: "Full Government & Customs Approvals",
    description:
      "We prepare all official shipping documents required by customs authorities across the USA, Europe, Middle East, and Asia.",
    features: [
      "Certificate of Origin (Chamber of Commerce)",
      "Plant Health (Phytosanitary) certificate",
      "Commercial invoice, packing list & Bill of Lading",
      "Independent lab test reports (SGS or Eurofins)",
    ],
    iconName: "FileCheck2",
  },
];

export const MOCK_EXPORT_PROCESS_STEPS: ExportProcessStep[] = [
  {
    stepNumber: 1,
    title: "1. Send Your Inquiry",
    duration: "Day 1",
    description:
      "Tell us what spices you need, your required quantity, preferred packaging size, and your destination seaport.",
    deliverable: "Quick reply with an order checklist",
    actionRequired: "Send inquiry on our website or WhatsApp",
    iconName: "FileText",
  },
  {
    stepNumber: 2,
    title: "2. Check Stock & Quality",
    duration: "Day 1 - 2",
    description:
      "Our team checks fresh crop availability from our farmers and confirms food safety standards for your country.",
    deliverable: "Stock availability and spice specifications",
    actionRequired: "Confirm spice grade and order details",
    iconName: "Search",
  },
  {
    stepNumber: 3,
    title: "3. Clear Price Quote",
    duration: "Day 2 - 3",
    description:
      "We send you a formal Proforma Invoice with itemized spice prices, shipping options (FOB, CIF), and clear payment terms.",
    deliverable: "Itemized Price Quote (Proforma Invoice)",
    actionRequired: "Review and approve the price quote",
    iconName: "Calculator",
  },
  {
    stepNumber: 4,
    title: "4. Free Sample Approval",
    duration: "Day 4 - 8",
    description:
      "We courier sealed spice samples from the actual batch directly to your office so you can check aroma, color, and lab purity.",
    deliverable: "Courier tracking code for your sample package",
    actionRequired: "Test sample and confirm your approval",
    iconName: "Sparkles",
  },
  {
    stepNumber: 5,
    title: "5. Order Agreement & Packing",
    duration: "Day 8 - 18",
    description:
      "After contract confirmation, we clean, grind, and pack your spices into strong 25kg/50kg bags or custom boxes with your labels.",
    deliverable: "Photos of packing, bag labels, and batch details",
    actionRequired: "Sign contract and arrange payment",
    iconName: "Boxes",
  },
  {
    stepNumber: 6,
    title: "6. Port Check & Container Loading",
    duration: "Day 18 - 24",
    description:
      "Spices receive government plant health inspection and are carefully loaded into sea containers with moisture-barrier liners.",
    deliverable: "Plant health certificate and container loading photos",
    actionRequired: "Review draft shipping papers",
    iconName: "Ship",
  },
  {
    stepNumber: 7,
    title: "7. Ship Departure & Delivery",
    duration: "Vessel transit",
    description:
      "Your container sets sail across the ocean. We courier original shipping documents to you and track your ship until it reaches your port.",
    deliverable: "Original Bills of Lading and Certificate of Origin",
    actionRequired: "Receive documents and receive cargo at your port",
    iconName: "CheckCircle2",
  },
];

export const MOCK_FAQS: FAQItem[] = [
  {
    question: "What are your minimum order quantities (MOQ)?",
    answer:
      "Because we operate on a B2B wholesale export basis, standard minimum orders typically start at 1 Metric Tonne (1,000 kg) for high-value spices such as green cardamom and cloves, and Full Container Loads (20ft FCL ~14 to 18 MT) for commodities like turmeric and coriander. Consolidated LCL shipments across multiple spices are also available on request.",
    category: "orders",
  },
  {
    question: "How are export prices determined?",
    answer:
      "All pricing is strictly quotation-based. Spice markets fluctuate based on seasonal harvest yield, weather, international demand, and currency rates. We provide transparent, itemized quotations based on FOB Indian port or CIF destination port with agreed validity windows.",
    category: "payment",
  },
  {
    question: "Do you supply pre-shipment samples to prospective buyers?",
    answer:
      "Yes. For verified commercial buyers and serious trade inquiries, we dispatch representative pre-shipment samples via DHL/FedEx so your quality control team can run independent laboratory and sensory evaluations prior to bulk contract execution.",
    category: "quality",
  },
  {
    question: "Which Indian ports do you ship through?",
    answer:
      "Depending on the spice origin and sea freight routing, we dispatch cargo through major Eastern and Southern Indian ports including Paradip and Kolkata (for Odisha and eastern regional produce), Visakhapatnam, Chennai, and Cochin / Tuticorin for southern varieties.",
    category: "shipping",
  },
  {
    question: "What export documentation accompanies every shipment?",
    answer:
      "Standard shipping documentation includes: Commercial Invoice, Packing List, Full Set Clean on Board Ocean Bills of Lading, Certificate of Origin, Government Phytosanitary Certificate, and Fumigation Certificate. Independent lab assays (SGS, Eurofins) can be arranged as specified in the contract.",
    category: "shipping",
  },
];
