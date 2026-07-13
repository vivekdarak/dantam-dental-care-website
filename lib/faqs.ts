import { site } from "@/lib/site";

export type FaqAnswerPart = {
  text: string;
  href?: string;
  external?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string | FaqAnswerPart[];
};

export const homepageFaqs: FaqItem[] = [
  {
    question: "How often should I visit the dentist?",
    answer:
      "We recommend visiting your dentist every six months for a routine dental check-up and professional cleaning. Regular visits help detect cavities, gum disease, and other oral health problems early, preventing more extensive treatment later.",
  },
  {
    question: "What should I do if I have a toothache?",
    answer:
      "A toothache may indicate decay, infection, or trauma. Avoid self-medication and schedule a dental appointment as soon as possible. Early treatment can often save the tooth and prevent complications.",
  },
  {
    question: "Do root canal treatments hurt?",
    answer:
      "No. Modern root canal treatment is performed under local anesthesia and is generally no more uncomfortable than getting a dental filling. Our priority is to make your treatment as comfortable and pain-free as possible.",
  },
  {
    question: "When do I need a dental implant?",
    answer:
      "Dental implants are the best option for replacing missing teeth. They look, feel, and function like natural teeth while preserving your jawbone and restoring your smile.",
  },
  {
    question: "How long do dental implants last?",
    answer:
      "With proper oral hygiene, regular dental check-ups, and good overall health, dental implants can last for many years, often a lifetime.",
  },
  {
    question: "Is teeth whitening safe?",
    answer:
      "Yes. Professional teeth whitening performed by a qualified dentist is safe, effective, and provides better results than over-the-counter whitening products.",
  },
  {
    question: "What is a smile makeover?",
    answer:
      "A smile makeover is a customized combination of cosmetic dental treatments such as veneers, crowns, teeth whitening, orthodontics, or dental implants to improve the appearance and function of your smile.",
  },
  {
    question: "Why are my gums bleeding while brushing?",
    answer:
      "Bleeding gums are often an early sign of gum disease. It is important to seek professional dental care rather than ignoring the problem, as early treatment can prevent more serious complications.",
  },
  {
    question: "What causes bad breath?",
    answer:
      "Bad breath may result from poor oral hygiene, gum disease, tooth decay, dry mouth, or certain medical conditions. A dental examination can help identify and treat the underlying cause.",
  },
  {
    question: "Can children visit your clinic?",
    answer:
      "Absolutely. We welcome patients of all ages and provide gentle, child-friendly dental care to help children develop healthy oral habits from an early age.",
  },
  {
    question: "How can I prevent cavities?",
    answer:
      "Brush twice daily with fluoride toothpaste, floss every day, reduce sugary foods and drinks, and visit your dentist regularly for preventive check-ups and cleanings.",
  },
  {
    question: "Do you provide emergency dental treatment?",
    answer:
      "Yes. If you experience severe tooth pain, swelling, dental trauma, a knocked-out tooth, or a broken tooth, please contact us immediately. We will do our best to provide prompt emergency care.",
  },
  {
    question: "What should I do if I break a tooth?",
    answer:
      "Rinse your mouth with warm water, avoid chewing on the affected side, and visit the dentist as soon as possible. Quick treatment can often save the tooth.",
  },
  {
    question: "How long does a dental filling last?",
    answer:
      "Depending on the material used and your oral hygiene habits, dental fillings can last anywhere from 5 to 15 years or longer.",
  },
  {
    question: "Is dental treatment safe during pregnancy?",
    answer:
      "Yes. Routine dental check-ups and many dental treatments are safe during pregnancy. Maintaining good oral health is important for both the mother and the baby. Always inform your dentist if you are pregnant.",
  },
  {
    question: "What are wisdom teeth, and do they always need to be removed?",
    answer:
      "Not necessarily. Wisdom teeth are removed only if they are impacted, infected, causing pain, damaging nearby teeth, or creating other dental problems.",
  },
  {
    question: "How can I improve my smile?",
    answer:
      "Depending on your needs, options may include teeth whitening, veneers, orthodontic treatment, crowns, dental implants, or a complete smile makeover. We will recommend the best treatment after a thorough evaluation.",
  },
  {
    question: "Are digital dental X-rays safe?",
    answer:
      "Yes. Modern digital X-rays use significantly less radiation than traditional X-rays and are considered very safe while providing highly accurate diagnostic information.",
  },
  {
    question: "Why should I choose Dantam Dental Care?",
    answer:
      "At Dantam Dental Care, we combine over 13 years of clinical experience with ethical dentistry, advanced technology, personalized treatment planning, and a commitment to patient comfort. Our goal is to provide high-quality dental care that helps you enjoy a healthy, confident smile for years to come.",
  },
  {
    question: "How can I book an appointment?",
    answer: [
      { text: "Booking an appointment is simple. You can " },
      { text: "call our clinic", href: site.phones[0].href },
      { text: ", send us a " },
      { text: "WhatsApp message", href: site.whatsapp.href, external: true },
      { text: ", or use the " },
      { text: "appointment form", href: "/contact" },
      { text: " on our website. Our team will help you schedule a convenient time for your visit." },
    ],
  },
];
