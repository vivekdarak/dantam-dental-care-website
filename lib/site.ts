import {
  Award,
  Baby,
  GraduationCap,
  HeartHandshake,
  Leaf,
  LucideIcon,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const site = {
  name: "Dantam Dental Care",
  tagline: "Smile for a lifetime",
  location: "Thane, Maharashtra, India",
  phones: [
    { label: "+91 84840 92077", href: "tel:+918484092077" },
    { label: "022-4516 5841", href: "tel:+912245165841" },
  ],
  whatsapp: { label: "WhatsApp us", href: "https://wa.me/918484092077" },
  email: { label: "dantamsmile@gmail.com", href: "mailto:dantamsmile@gmail.com" },
  hours: "Mon - Sat: 10:30 AM to 9:30 PM | Sunday Closed",
  mapLink: "https://maps.app.goo.gl/XVmRwdNM6yts4t626",
  mapEmbed: "https://www.google.com/maps?q=Dantam+Dental+Care+Thane&output=embed",
};

export const locations = [
  {
    area: "Majiwada",
    name: "Dantam Dental Care",
    address:
      "Office No. 3, 2nd floor (P3), I Wing Retail, Rustomjee Azziano, above Wellness Forever Medical, near Rustomjee Cambridge School, Rustomjee Urbania, Majiwada, Thane (W) - 400 601.",
    shortAddress: "Rustomjee Urbania, Majiwada, Thane West",
    phone: { label: "84840 92077", href: "tel:+918484092077" },
    mapLink: "https://maps.app.goo.gl/XVmRwdNM6yts4t626",
    mapEmbed: "https://www.google.com/maps?q=Dantam+Dental+Care+Majiwada+Thane&output=embed",
  },
  {
    area: "Shreenagar",
    name: "Modi Dental Clinic",
    address:
      "Shop no. 31, Shreenagar Market Complex, below TJSB Bank, Ashram Road, Shreenagar, Wagle Estate, Thane (W) - 400 604.",
    shortAddress: "Shreenagar Market Complex, Wagle Estate, Thane West",
    phone: { label: "95949 07908", href: "tel:+919594907908" },
    mapLink: "https://maps.app.goo.gl/b3V331zvNXHi83SC9",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.129666153241!2d72.9419403348877!3d19.189538100000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b90749c3cec7%3A0x9e5e7ac2f4e6d9a4!2sMODI%20DENTAL%20CLINIC%20(%20Dantam%20Dental%20Care)!5e0!3m2!1sen!2sin!4v1783928615227!5m2!1sen!2sin",
  },
  {
    area: "Nalasopara",
    name: "Gonsalves Dental Care",
    address:
      "Shop no. 6, Omkar Niwas, Samelpada, in front of Little Flower High School, Nalasopara (W) - 401 203.",
    shortAddress: "Samelpada, near Little Flower High School, Nalasopara West",
    phone: { label: "83900 79324", href: "tel:+918390079324" },
    mapLink: "https://maps.app.goo.gl/mPCPqaXUpaFS9A5n8",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.647057389532!2d72.8252261!3d19.427649799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ab02b2d09497%3A0x707fad55c569a3c2!2sGonsalves%20Dental%20care!5e0!3m2!1sen!2sin!4v1783928545190!5m2!1sen!2sin",
  },
] as const;

export const services = [
  {
    slug: "child-dental-care",
    title: "Child Dental Care",
    short: "Gentle, playful dentistry designed for little smiles.",
    image: "/images/service-pedo.jpg",
  },
  {
    slug: "aligners",
    title: "Aligners",
    short: "Clear, removable aligners for a discreet smile transformation.",
    image: "/images/invisalign-provider.png",
  },
  {
    slug: "braces",
    title: "Braces",
    short: "Traditional and ceramic braces to correct alignment and bite.",
    image: "/images/dantam-braces.png",
  },
  {
    slug: "implants",
    title: "Implants",
    short: "Permanent tooth replacement placed by an experienced implantologist.",
    image: "/images/dental-implant.png",
  },
  {
    slug: "tooth-extraction",
    title: "Tooth Extraction",
    short: "Safe, precise tooth removal with minimal downtime.",
    image: "/images/tooth-extraction-2.png",
  },
  {
    slug: "root-canal-treatments",
    title: "Root Canal Treatments",
    short: "Modern root canal care, including single-sitting RCT where suitable.",
    image: "/images/root-canal-treatment.png",
  },
  {
    slug: "intraoral-scanner",
    title: "Intraoral Scanner",
    short: "Digital impressions in minutes, with no messy trays or gagging.",
    image: "/images/intraoral-scanner.png",
  },
  {
    slug: "smile-designing",
    title: "Smile Designing",
    short: "Aesthetic planning for a natural, confident smile makeover.",
    image: "/images/service-smile-designing-new.jpg",
  },
  {
    slug: "full-mouth-rehabilitation",
    title: "Full Mouth Rehabilitation",
    short: "Focused gum treatment for healthier foundations and cleaner smiles.",
    image: "/images/full-mouth-rehabilitation-3.png",
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    short: "Professional teeth bleaching to brighten stains safely.",
    image: "/images/teeth-whitening-2.png",
  },
  {
    slug: "dentures",
    title: "Dentures",
    short: "Comfortable removable teeth replacement for daily function.",
    image: "/images/dentures-1.png",
  },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

export type ServiceContent = {
  hero: string;
  what: string;
  who: string[];
  steps: { title: string; desc: string }[];
  benefits: string[];
  faqs: { q: string; a: string }[];
};

export const serviceContent: Record<ServiceSlug, ServiceContent> = {
  "child-dental-care": {
    hero: "Your child's first dental home, where visits feel like play, not procedure.",
    what: "Paediatric dentistry focuses on the oral health of infants, children and adolescents. From the first tooth through the teenage years, our team creates positive experiences that build a lifetime of confident smiles.",
    who: ["First-tooth checkups (6 months+)", "Cavity prevention and fluoride varnish", "Kid-friendly fillings and crowns", "Habit correction for thumb sucking and tongue thrusting", "Anxious or special-needs children"],
    steps: [
      { title: "Welcome and tour", desc: "We show your child around and let them meet the chair and instruments." },
      { title: "Gentle examination", desc: "A non-invasive check-up with plenty of reassurance." },
      { title: "Prevention plan", desc: "Personalised brushing, diet and hygiene guidance to take home." },
    ],
    benefits: ["Positive lifelong association with dental visits", "Early cavity prevention saves pain and cost later", "Kid-safe materials and short appointments"],
    faqs: [
      { q: "What age should my child first visit?", a: "Ideally by the first birthday, or within 6 months of the first tooth erupting." },
      { q: "Are treatments painful?", a: "We use topical numbing and child-sized instruments. Most preventive treatments are entirely painless." },
    ],
  },
  aligners: {
    hero: "Straighten your smile discreetly with removable, virtually invisible aligners.",
    what: "Clear aligners are custom-made transparent trays that gradually move your teeth into place. They are ideal for adults and teens who want to straighten their smile without traditional braces.",
    who: ["Mild to moderate crowding or spacing", "Professionals wanting a discreet option", "Patients who prefer removable trays for eating and brushing"],
    steps: [
      { title: "3D digital scan", desc: "A quick digital scan captures your teeth without messy impressions." },
      { title: "Treatment simulation", desc: "Preview your final smile before you begin." },
      { title: "Aligner series", desc: "Wear each set 20-22 hours a day and change every 1-2 weeks." },
    ],
    benefits: ["Virtually invisible", "Removable for meals and photos", "Fewer clinic visits than braces", "Predictable, planned results"],
    faqs: [
      { q: "How long does treatment take?", a: "Most cases finish in 6-18 months depending on complexity." },
      { q: "Will it affect my speech?", a: "There is a brief adjustment period of 1-3 days. Almost no one notices after the first week." },
    ],
  },
  braces: {
    hero: "Time-tested precision to correct alignment, bite and jaw issues.",
    what: "Traditional and ceramic braces remain the gold standard for correcting complex orthodontic cases. We offer metal, ceramic tooth-coloured, and self-ligating options.",
    who: ["Moderate to severe crowding", "Bite corrections including overbite, underbite and crossbite", "Teens and adults alike"],
    steps: [
      { title: "Orthodontic evaluation", desc: "Photographs, X-rays and a full bite analysis." },
      { title: "Bracket placement", desc: "Painless bonding of brackets and archwire in one visit." },
      { title: "Monthly adjustments", desc: "Short visits every 4-6 weeks to keep progress on track." },
    ],
    benefits: ["Works for the most complex cases", "Ceramic option is discreet", "Predictable long-term stability"],
    faqs: [
      { q: "Does putting on braces hurt?", a: "Placement is painless. Mild soreness for 2-3 days after each adjustment is normal." },
      { q: "How long is treatment?", a: "Typically 12-24 months." },
    ],
  },
  implants: {
    hero: "Permanent tooth replacement that looks, feels and functions like your own.",
    what: "A dental implant is a small titanium post placed in the jawbone that acts as an artificial root, supporting a crown, bridge or full denture. Dr. Krushnakumar Modi has placed thousands of implants since 2014.",
    who: ["Missing single or multiple teeth", "Loose or ill-fitting dentures", "Failing bridges or long-term tooth loss"],
    steps: [
      { title: "3D CBCT planning", desc: "Digital planning ensures precise and safe placement." },
      { title: "Implant placement", desc: "A single visit procedure, with same-day discharge." },
      { title: "Healing", desc: "Bone fuses with the implant over roughly 3-4 months." },
      { title: "Crown fitting", desc: "Your custom tooth-coloured crown is placed." },
    ],
    benefits: ["Long-term solution with proper care", "Preserves jaw bone and facial structure", "No damage to adjacent teeth"],
    faqs: [
      { q: "Am I too old for implants?", a: "Age is rarely a barrier. Health matters more than age, and implants can work well for older patients." },
      { q: "Is the procedure painful?", a: "Placement is done under local anaesthesia and most patients say it was easier than expected." },
    ],
  },
  "tooth-extraction": {
    hero: "Safe, precise tooth extraction with minimal downtime.",
    what: "Tooth extraction removes a badly damaged, infected, loose or impacted tooth when saving it is not the best long-term option. This includes wisdom teeth removal and surgical extraction when needed.",
    who: ["Impacted or partially erupted wisdom teeth", "Recurring gum infection", "Pressure or pain from third molars"],
    steps: [
      { title: "Digital X-ray", desc: "We assess the tooth position and root anatomy." },
      { title: "Local anaesthesia", desc: "Full numbing before the procedure begins." },
      { title: "Precise surgical removal", desc: "Most removals take 20-45 minutes per tooth." },
      { title: "Recovery guidance", desc: "Personalised aftercare, medication and diet guidance." },
    ],
    benefits: ["Prevents crowding of front teeth", "Eliminates recurring infections", "Same-day discharge"],
    faqs: [
      { q: "Can all four be removed together?", a: "Yes, if it suits your case. This can shorten overall recovery time." },
      { q: "How long is the swelling?", a: "Mild swelling peaks around 48 hours and settles within 5-7 days." },
    ],
  },
  "root-canal-treatments": {
    hero: "Modern root canal treatments, including single-sitting RCT where suitable.",
    what: "With rotary endodontics and apex locators, we complete most root canals in one comfortable visit rather than 3-4 traditional appointments. Dr. Blanch Gonsalves Modi is our resident single-sitting RCT expert.",
    who: ["Deep decay reaching the tooth pulp", "Persistent sensitivity or throbbing pain", "Cracked teeth needing structural preservation"],
    steps: [
      { title: "Digital diagnosis", desc: "X-ray and pulp testing confirm the need for RCT." },
      { title: "Anaesthesia and isolation", desc: "Complete numbing with a rubber dam for cleanliness." },
      { title: "Cleaning and shaping", desc: "Rotary instruments clean the canal precisely." },
      { title: "Filling and sealing", desc: "Canals are sealed and the tooth restored in one visit." },
    ],
    benefits: ["One appointment instead of three", "Painless with modern anaesthesia", "Saves the natural tooth for decades"],
    faqs: [
      { q: "Will I need a crown afterwards?", a: "Most back teeth benefit from a zirconia crown to protect the treated tooth long-term." },
      { q: "How long does the visit take?", a: "Typically 60-90 minutes." },
    ],
  },
  "intraoral-scanner": {
    hero: "Digital impressions in minutes, with no messy trays and no gagging.",
    what: "Our intraoral 3D scanner captures a precise digital model of your teeth in under 5 minutes. It supports aligners, crowns, smile simulations and treatment planning.",
    who: ["Aligner and orthodontic planning", "Crowns, veneers and bridges", "Implant surgical guides", "Patients with strong gag reflex"],
    steps: [
      { title: "Comfortable scan", desc: "A small wand glides over your teeth for 3-5 minutes." },
      { title: "Instant 3D model", desc: "Your teeth appear live on screen for review." },
      { title: "Precision workflow", desc: "The model is sent to the lab or planning software." },
    ],
    benefits: ["No goop or gagging", "Higher accuracy than physical impressions", "Faster turnaround for lab work", "Visual treatment planning"],
    faqs: [
      { q: "Is scanning safe?", a: "Yes. It uses harmless light, not radiation." },
      { q: "Can I keep a copy?", a: "Yes, we can share your 3D scan on request." },
    ],
  },
  "smile-designing": {
    hero: "Plan a smile that looks natural, balanced and truly yours.",
    what: "Smile designing combines cosmetic dentistry, digital planning and careful shade, shape and alignment decisions to improve the way your smile looks while keeping it functional and natural.",
    who: ["Uneven, chipped or worn teeth", "Gaps, stains or minor shape concerns", "Patients planning a smile makeover", "Before weddings, events or professional milestones"],
    steps: [
      { title: "Smile assessment", desc: "We study your face, teeth, bite, photographs and expectations." },
      { title: "Digital planning", desc: "Your options are planned around tooth shape, shade, gum line and smile symmetry." },
      { title: "Treatment selection", desc: "We recommend the right mix of whitening, bonding, veneers, crowns or aligners." },
      { title: "Final finishing", desc: "Small refinements help the final smile look polished and natural." },
    ],
    benefits: ["Personalised smile makeover planning", "Improves colour, shape and proportion", "Can combine cosmetic and restorative dentistry", "Natural-looking aesthetic results"],
    faqs: [
      { q: "Is smile designing only cosmetic?", a: "No. A good smile design also considers bite, tooth health and long-term function." },
      { q: "Will my smile look artificial?", a: "Our goal is a natural smile that suits your face, not an overdone or one-size-fits-all result." },
    ],
  },
  "full-mouth-rehabilitation": {
    hero: "Specialised gum care for healthier teeth and stronger foundations.",
    what: "Periodontal gum surgery treats gum disease, deep infection, gum pockets and supporting tissue problems when regular cleaning is not enough. The aim is to control disease, protect teeth and restore healthier gums.",
    who: ["Bleeding or swollen gums", "Loose teeth due to gum disease", "Deep gum pockets or tartar below the gum line", "Patients advised advanced periodontal treatment"],
    steps: [
      { title: "Gum evaluation", desc: "We check gum pockets, mobility, bone support and oral hygiene patterns." },
      { title: "Deep cleaning", desc: "Scaling and root surface cleaning remove deposits around and below the gum line." },
      { title: "Surgical correction", desc: "When required, gum surgery allows better access to clean infected areas and reshape tissues." },
      { title: "Maintenance plan", desc: "Follow-up cleanings and home-care guidance reduce the risk of recurrence." },
    ],
    benefits: ["Controls gum infection", "Helps protect natural teeth", "Improves gum health and hygiene access", "Supports long-term dental stability"],
    faqs: [
      { q: "Is gum surgery always required for gum disease?", a: "No. Many cases improve with deep cleaning and home care. Surgery is considered when disease is deeper or more advanced." },
      { q: "Will my gums heal completely?", a: "Healing depends on the severity of gum disease and maintenance. Regular follow-up is essential." },
    ],
  },
  "teeth-whitening": {
    hero: "Brighten your smile safely with professional teeth whitening.",
    what: "Teeth whitening, also called teeth bleaching, lightens external stains and natural tooth discolouration using dentist-supervised materials designed for safer, more predictable results than over-the-counter products.",
    who: ["Tea, coffee or tobacco stains", "Dull or yellow-looking teeth", "Patients preparing for events or photographs", "Smile makeover patients needing shade improvement"],
    steps: [
      { title: "Shade check", desc: "We record your current shade and check that whitening is suitable for your teeth." },
      { title: "Cleaning if needed", desc: "Surface deposits are removed so whitening can work more evenly." },
      { title: "Whitening session", desc: "Professional bleaching material is applied under controlled conditions." },
      { title: "Aftercare advice", desc: "We guide you on sensitivity care and stain control to maintain brightness." },
    ],
    benefits: ["Brighter smile without drilling", "Dentist-supervised bleaching", "Useful before cosmetic work", "Quick aesthetic improvement"],
    faqs: [
      { q: "Does whitening damage teeth?", a: "When done correctly under dental supervision, whitening is safe for suitable teeth." },
      { q: "How long does whitening last?", a: "Results vary with diet and habits, but good oral hygiene and stain control help maintain the shade longer." },
    ],
  },
  dentures: {
    hero: "Replace missing teeth with comfortable, practical dentures.",
    what: "Dentures are removable teeth replacements used when several or all teeth are missing. They help restore chewing, speech and facial support, and can be made as complete dentures, partial dentures or implant-supported options.",
    who: ["Missing many or all teeth", "Patients needing removable teeth replacement", "Loose old dentures needing replacement", "Patients exploring affordable tooth replacement"],
    steps: [
      { title: "Oral assessment", desc: "We check gum health, bone support, bite and the number of teeth to replace." },
      { title: "Impressions and records", desc: "Measurements help create dentures that fit your mouth and bite." },
      { title: "Trial fitting", desc: "Shape, bite, comfort and appearance are checked before final finishing." },
      { title: "Final fit and adjustments", desc: "We fine-tune sore spots and guide you through eating and cleaning." },
    ],
    benefits: ["Restores missing teeth", "Supports speech and chewing", "Can improve facial fullness", "Removable and cleanable"],
    faqs: [
      { q: "Will dentures feel natural immediately?", a: "There is an adjustment period. Most patients adapt with practice and small fit corrections." },
      { q: "Can dentures be fixed with implants?", a: "Yes. Implant-supported dentures can improve stability for suitable patients." },
    ],
  },
};

export const stats = [
  { value: "12+", label: "Years of practice" },
  { value: "5,000+", label: "Implants placed" },
  { value: "20,000+", label: "Happy patients" },
  { value: "1 visit", label: "Single-sitting RCT" },
];

export const pillars: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: HeartHandshake, title: "Patient-first care", desc: "Every treatment plan begins with listening. No pressure, no upselling." },
  { icon: ScanLine, title: "Digital dentistry", desc: "3D intraoral scanning, digital X-rays and computerised planning." },
  { icon: ShieldCheck, title: "Sterilisation you can see", desc: "Autoclave-sterilised instruments, single-use kits and clean workflows." },
  { icon: Award, title: "Experienced hands", desc: "12+ years of practice, thousands of implants and single-sitting RCTs completed." },
  { icon: Leaf, title: "Calm environment", desc: "Warm, homelike interiors designed to reduce dental anxiety." },
  { icon: Sparkles, title: "Aesthetic focus", desc: "From smile design to full-mouth rehab, dentistry that looks like nature." },
];

export const team = [
  {
    name: "Dr. Krushnakumar Modi",
    role: "General Dentist & Expert Implantologist",
    credentials: "BDS (MUHS) A-21550",
    image: "/images/dr-krushnakumar-modi.jpeg",
    bio: "Specializing in advanced implantology since 2014, Dr. Krushnakumar has successfully placed thousands of dental implants for patients ranging from young adults to seniors, ages 17 to 88. With extensive experience performing and assisting in major oral and maxillofacial surgeries, he specializes in full-mouth prosthetic restorations, bringing back complete function and natural aesthetics to your smile.",
    special: ["Advanced implantology", "Full-mouth prosthetic restorations", "Oral and maxillofacial surgery"],
    icon: Award,
  },
  {
    name: "Dr. Blanch Gonsalves Modi",
    role: "General, Cosmetic & Aesthetic Dentist",
    credentials: "BDS (MUHS) A-21379",
    image: "/images/dr-blanch-gonsalves.jpeg",
    bio: "Dr. Blanch is dedicated to changing the way you experience dental care. Renowned for her expertise in single-sitting root canal treatments and full-mouth rehabilitations, she takes the fear out of complex procedures. Patients widely admire her for her comprehensive, multipolar diagnosis, ensuring that every unique dental issue is met with a clear, personalized, and long-term recovery plan.",
    special: ["Single-sitting root canals", "Full-mouth rehabilitation", "Cosmetic and aesthetic dentistry"],
    icon: Sparkles,
  },
];

export const consultants = [
  {
    name: "Dr. Arpit Chanchad",
    role: "Visiting Consultant",
    credentials: "Consultant Doctor",
    image: "/images/dr-danesh-nair.jpg",
    bio: "A visiting consultant supporting Dantam Dental Care with specialist-led treatment planning and clinical care.",
    special: ["Braces", "Aligners", "Orthodontist", "Invisalign Specialist"],
    icon: GraduationCap,
  },
  {
    name: "Dr. Sanika Palan",
    role: "Children Dental & Preventive Dentistry Specialist",
    credentials: "M.D.S (Pedodontist)",
    image: "/images/dr-sanika-palan.jpeg",
    bio: "A visiting pedodontist specialising in children's dental care and preventive dentistry, helping young patients build healthy habits and comfortable dental experiences.",
    special: ["Children's dentistry", "Preventive dentistry", "Pedodontics"],
    icon: GraduationCap,
  },
  {
    name: "Dr. Prasad Bhange",
    role: "Oral & Maxillofacial Surgeon (Visiting)",
    credentials: "KEM Hospital, Parel | 20+ years",
    image: "/images/dr-prasad-bhange.jpg",
    bio: "A visiting oral and maxillofacial surgeon associated with King Edward Memorial Hospital, Parel, supporting Dantam on complex surgical cases.",
    special: ["Oral surgery", "Maxillofacial surgery", "Complex surgical cases"],
    icon: GraduationCap,
  },
  {
    name: "Dr. Danesh Nair",
    role: "Visiting Consultant",
    credentials: "Consultant Doctor",
    image: "/images/dr-arpit-chanchad.jpg",
    bio: "A visiting consultant supporting Dantam Dental Care with specialist-led treatment planning and clinical care.",
    special: ["Gum Care", "Periodontal Surgeries", "Oral Rehabilitation"],
    icon: GraduationCap,
  },
];

export const testimonials = [
  { name: "Anjali M.", city: "Thane West", service: "Root Canal", quote: "I got my root canal done in one sitting and it was completely painless. The clinic feels calm, nothing like the dentists I visited as a child." },
  { name: "Rahul S.", city: "Ghodbunder", service: "Implants", quote: "Dr. Modi placed three implants for my 74-year-old father. Wonderful hands and an even better bedside manner. Highly recommend." },
  { name: "Priya D.", city: "Kolshet", service: "Kids Dentistry", quote: "Took my 6-year-old here terrified of dentists. She now asks when we're going back. Grateful to the whole team." },
  { name: "Neha K.", city: "Thane", service: "Aligners", quote: "Started my aligner journey with Dr. Blanch. The 3D scan preview convinced me, and my smile today matches what she showed me." },
  { name: "Vikas T.", city: "Naupada", service: "Zirconia Cap", quote: "Got two zirconia crowns and honestly cannot tell them apart from my natural teeth. Fantastic work." },
  { name: "Sneha R.", city: "Vartak Nagar", service: "Braces", quote: "24 months of braces done. The team was patient, transparent about timelines, and my bite is perfect now." },
  { name: "Amit P.", city: "Thane East", service: "Wisdom Teeth", quote: "Had all four wisdom teeth removed in one go. Very little swelling and I was back to office in 2 days." },
  { name: "Meera J.", city: "Manpada", service: "Implants", quote: "After years of a shaky bridge, my implant crown feels rock solid. The digital planning made everything predictable." },
  { name: "Rohan G.", city: "Thane", service: "Root Canal", quote: "Walked in at 8pm with a killer toothache and walked out at 9:30pm with a sealed root canal. Life-savers." },
];

export const whyChoose = [
  { icon: ScanLine, title: "Digital 3D scanning", desc: "Precise, gag-free impressions and predictable outcomes." },
  { icon: ShieldCheck, title: "Single-sitting RCT", desc: "Root canals done comfortably in one visit." },
  { icon: Award, title: "Implantology since 2014", desc: "Thousands of implants placed across a wide age range." },
  { icon: Baby, title: "Gentle, family-first", desc: "From toddlers to grandparents, care that feels calm." },
];
