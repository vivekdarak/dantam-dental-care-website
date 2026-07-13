export type InstructionSection = {
  id: string;
  title: string;
  englishTitle: string;
  marathiTitle: string;
  english: string[];
  marathi: string[];
};

export const patientInstructionSections: InstructionSection[] = [
  {
    id: "important-instructions",
    title: "Important Instructions to All Patients",
    englishTitle: "English",
    marathiTitle: "मराठी",
    english: [
      "Please inform the Doctor before the procedure if you are suffering from any medical illness or allergic to certain medicines.",
      "Please inform the Clinic if you are suffering from any contagious disease and on medications for the same.",
      "Clinic or the treating Doctor won't be responsible in case of any medical complication due to improper history given by Patient or Guardian.",
      "In case of orthodontic treatments, relapse is common. Please use the given set of retainers to avoid relapse.",
      "Prefer to visit clinic with prior appointment to avoid waiting time.",
      "Please follow the instructions given by the Doctor post dental treatment.",
      "Warranty for crowns and bridges covers only replacement and not cash reimbursement. Warranty does not cover breakage or failure resulting from accident or misuse. Warranty is subject only to manufacturing defect.",
      "In case of any complaint or suggestions please write us at dantamsmile@gmail.com.",
    ],
    marathi: [
      "कृपया उपचारापूर्वी डॉक्टरांना आपणास कोणताही वैद्यकीय आजार असल्यास किंवा कोणत्याही औषधांची अॅलर्जी असल्यास अवश्य कळवा.",
      "आपणास कोणताही संसर्गजन्य आजार असल्यास किंवा आपण नियमित औषधे घेत असल्यास कृपया क्लिनिकला त्याची माहिती द्या.",
      "रुग्ण किंवा पालकांनी अपूर्ण किंवा चुकीची वैद्यकीय माहिती दिल्यास त्यातून उद्भवणाऱ्या वैद्यकीय गुंतागुंतीसाठी क्लिनिक किंवा उपचार करणारे डॉक्टर जबाबदार राहणार नाहीत.",
      "ऑर्थोडॉन्टिक उपचारांमध्ये दात पुन्हा पूर्वस्थितीकडे जाण्याची शक्यता असते. हे टाळण्यासाठी दिलेले रिटेनर्स नियमित वापरावेत.",
      "प्रतीक्षा वेळ टाळण्यासाठी कृपया पूर्वनियोजित अपॉइंटमेंट घेऊनच क्लिनिकला भेट द्यावी.",
      "दंत उपचारानंतर डॉक्टरांनी दिलेल्या सर्व सूचनांचे काटेकोरपणे पालन करावे.",
      "क्राउन आणि ब्रिजेसची वॉरंटी फक्त बदलून देण्यापुरती मर्यादित आहे; रोख परतावा दिला जाणार नाही. अपघात, चुकीचा वापर किंवा तुटणे यामुळे झालेल्या नुकसानीवर वॉरंटी लागू होणार नाही. वॉरंटी केवळ उत्पादनातील दोषांपुरती मर्यादित असेल.",
      "कोणतीही तक्रार किंवा सूचना असल्यास कृपया आम्हाला dantamsmile@gmail.com येथे लिहा.",
    ],
  },
  {
    id: "extraction-surgery",
    title: "Instructions After Extraction / Surgery",
    englishTitle: "English",
    marathiTitle: "मराठी",
    english: [
      "Please hold the given cotton pack for 1 hour in your mouth. After 1 hour, remove the cotton pack.",
      "Do not put your tongue or finger on the extraction side.",
      "Do not spit or rinse out for the next 24 hours. Keep swallowing saliva.",
      "After removing the cotton pack, have ice cream and take prescribed medicines.",
      "Apply an ice pack on the outside of the affected area for the next 6-8 hours.",
      "For 2 days, have only soft, cold, and bland foods. Do not have anything hot or spicy for 2 days.",
      "After 48 hours, start warm water-salt gargles 3-4 times a day.",
      "Do not smoke or drink for at least 7 days after extraction.",
      "Next day morning, please do regular brushing of teeth but avoid the extraction site.",
      "Follow the above instructions strictly.",
    ],
    marathi: [
      "एक तास कापसाचा बोळा तोंडात घट्ट दाबून ठेवावा.",
      "एक तासानंतर कापसाचा बोळा काढून टाकावा. दुसरा कोणताही कापूस तोंडात ठेवू नये. काढलेल्या जागेवर जीभ किंवा बोट लावू नये.",
      "एक तासानंतर आईस्क्रीमसारखे थंड पदार्थ खावेत आणि त्यानंतर औषधे घ्यावीत.",
      "दात काढलेल्या जागेवर बाहेरून बर्फ लावावे.",
      "दात काढल्यानंतर 24 तास थुंकू नये. थुंकी, लाळ किंवा रक्त आले असल्यास ते गिळून घ्यावे.",
      "दात काढल्यानंतर 2 दिवस फक्त थंड व मऊ पदार्थ खावेत. गरम, तिखट आणि कडक पदार्थ टाळावेत.",
      "दात काढल्यानंतर तिसऱ्या दिवसापासून कोमट पाण्यात मीठ टाकून गुळण्या कराव्यात.",
      "दात काढल्यानंतर किमान 6 ते 7 दिवस धूम्रपान व मद्यपान करू नये.",
      "काढलेल्या दात 20 दिवसांत बसवावा.",
      "दुसऱ्या दिवशी किंवा सांगितल्याप्रमाणे तपासणीसाठी यावे.",
    ],
  },
  {
    id: "root-canal-treatment",
    title: "Instructions After Root Canal Treatment",
    englishTitle: "English",
    marathiTitle: "मराठी",
    english: [
      "Do not eat till the effect of the injection wears off.",
      "Do not use the treated side for chewing for 2 to 3 days.",
      "After 2-3 days, start eating soft diet from that side.",
      "Do not eat hard food stuffs from that side till a full crown / cap is put on the tooth.",
      "Take medication as prescribed.",
    ],
    marathi: [
      "इंजेक्शनचा बधिरपणा उतरेपर्यंत काही खाऊ नये.",
      "काम केलेली बाजू 2-3 दिवसांकरिता खाण्यास वापरू नये.",
      "2-3 दिवसांनंतर त्या बाजूने नरम गोष्टी खाण्यास सुरुवात करावी.",
      "जोपर्यंत दातावर क्राउन / कॅप लागत नाही तोपर्यंत त्या बाजूने कडक पदार्थ खाऊ नयेत.",
      "औषधे नियमित घ्यावी.",
    ],
  },
];
