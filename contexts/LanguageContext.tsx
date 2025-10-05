"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  t: (key: string) => string;
  getLocalizedField: (obj: any, fieldName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Переводы интерфейса
const translations = {
  ru: {
    home: "Главная",
    categories: "Категории",
    places: "Места",
    tours: "Туры",
    back: "Назад",
    loading: "Загрузка...",
    error: "Ошибка загрузки",
    noData: "Нет данных",
    settings: "Настройки",
    language: "Язык",
    theme: "Тема",
    darkTheme: "Темная тема",
    lightTheme: "Светлая тема",
    fontSize: "Размер шрифта",
    small: "Маленький",
    normal: "Нормальный",
    large: "Большой",
    veryLarge: "Очень большой",
    save: "Сохранить",
    cancel: "Отмена",
    mainSettings: "Основные настройки",
    explore: "Туризм в Мангистау",
    selectCategory: "Выберите категорию для просмотра мест",
    details: "Подробнее",
    search: "Поиск мест",
    searchPlaceholder: "Введите название места или описание...",
    searchResults: "Результаты поиска",
    noSearchResults: "Ничего не найдено по вашему запросу",
    featuredPlaces: "Рекомендуемые места",
    previous: "Предыдущее",
    next: "Следующее",
    slide: "Слайд",
    map: "Карта",
    placesOnMap: "Мест на карте",
    showOnMap: "Показать на карте",
    showAllPlaces: "Показать все места",
    settingsSaved: "Настройки сохранены",
    Move: "Открыть",
    legends: "Легенды",
    price: "Цена",
    company: "Компания",
    services: "Услуги",
    contact: "Контакты",
    moreDetails: "Подробнее",
    tourDetails: "О туре",
    backToTours: "Вернуться к турам",
    placesInThisTour: "Места в этом туре",
    availableTours: "Доступные туры",
    noTours: "Нет доступных туров",
    noToursForThisPlace: "Для этого места нет доступных туров",
    errorLoadingTours: "Ошибка загрузки туров",
    retry: "Повторить",
    noImage: "Нет изображения",
    about: "О нас",
    phone: "Телефон",
    instagram: "Инстаграм",
    russian: "Русский",
    english: "Английский",
    kazakh: "Казахский",
    aboutDescription: "Apex Tourism - это ваша путеводная визитная карточка для изучения великолепного региона Мангистау. Наше приложение разработано, чтобы помочь путешественникам открывать для себя уникальные природные и культурные достопримечательности этой прекрасной области Казахстана.",
    ourMission: "Наша миссия",
    missionDescription: "Мы стремимся способствовать устойчивому туризму в Мангистау, предоставляя подробную информацию о местных достопримечательностях, повышая осведомленность о богатом культурном наследии региона и поддерживая местные предприятия и туроператоров.",
    whatWeOffer: "Что мы предлагаем",
    offer1: "Полная база данных туристических достопримечательностей Мангистау",
    offer2: "Подробная информация о каждом месте, включая историю, легенды и фотографии",
    offer3: "Интерактивная карта, которая поможет вам ориентироваться и исследовать регион",
    offer4: "Подборные туры, созданные местными экспертами",
    offer5: "Информация о местной культуре, традициях и обычаях",
    offer6: "Отзывы пользователей и рейтинги, которые помогут вам принимать обоснованные решения",
    whyChooseUs: "Почему выбирают Apex Tourism?",
    whyChooseUsDescription: "Наша команда сочетает местную экспертизу с современными технологиями, чтобы обеспечить вам лучший возможный туристический опыт. Мы работаем напрямую с местными гидами и туроператорами, чтобы обеспечить подлинные и незабываемые впечатления для наших посетителей.",
    trustedCompanion: "Ваш надежный туристический компаньон в Мангистау",
    // Company page translations
    companyAbout: "Mangystau Tour — это туристическая компания, специализирующаяся на организации путешествий по Мангистау. Мы показываем уникальную природу, исторические и культурные памятники региона, делая отдых ярким и незабываемым.",
    companyFounded: "Основано в 2015 году",
    companyAddress: "г. Актау, ул. Достык, 45",
    companyServices: [
      "Туры по Мангистау",
      "Экскурсии к Шерқала, Бозжыра, Тузбаир",
      "Сафари по степи",
      "Кемпинг и активный отдых"
    ],
    // Authentication translations
    profile: "Профиль",
    login: "Вход",
    signup: "Регистрация",
    email: "Email",
    password: "Пароль",
    fullName: "Полное имя",
    enterEmail: "Введите ваш email",
    enterPassword: "Введите ваш пароль",
    enterFullName: "Введите ваше имя",
    signIn: "Войти",
    signUp: "Зарегистрироваться",
    signOut: "Выйти",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    register: "Зарегистрироваться",
    loginAction: "Войти",
    profileUpdated: "Профиль успешно обновлен",
    errorLoadingProfile: "Ошибка при загрузке профиля",
    saveChanges: "Сохранить изменения",
    saving: "Сохранение...",
    signingOut: "Выход...",
    checkEmail: "Пожалуйста, проверьте вашу почту и подтвердите адрес электронной почты.",
    fillAllFields: "Пожалуйста, заполните все поля",
    passwordMinLength: "Пароль должен содержать минимум 6 символов",
    signupSuccess: "Регистрация успешна! Проверьте ваш email для подтверждения.",
    confirmPassword: "Подтвердите пароль",
    enterPasswordAgain: "Введите пароль еще раз",
    // Application name translations
    appName: "Apex Tourism",
    // Instagram translation
    visitInstagram: "Посетить Instagram",
    // 360° view translation
    view360: "360° Просмотр",
    // 360° view not available yet translation
    view360NotAvailable: "Пока что нету такого",
    // Chat translations
    aiAssistant: "ИИ Помощник",
    queuePending: "Очередь:",
    closeChat: "Закрыть чат",
    typeMessage: "Введите ваше сообщение...",
    sendMessage: "Отправить сообщение",
    send: "Отправить",
    chatError: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
    chatWelcomeMessage: "Напишите ваш вопрос, и я постараюсь помочь!"
  },
  en: {
    home: "Home",
    categories: "Categories",
    places: "Places",
    tours: "Tours",
    back: "Back",
    loading: "Loading...",
    error: "Loading error",
    noData: "No data",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkTheme: "Dark Theme",
    lightTheme: "Light Theme",
    fontSize: "Font size",
    small: "Small",
    normal: "Normal",
    large: "Large",
    veryLarge: "Very Large",
    save: "Save",
    cancel: "Cancel",
    mainSettings: "Main Settings",
    explore: "Tourism in Mangystau",
    selectCategory: "Select a category to view places",
    details: "Details",
    search: "Search places",
    searchPlaceholder: "Enter place name or description...",
    searchResults: "Search results",
    noSearchResults: "Nothing found for your request",
    featuredPlaces: "Featured places",
    previous: "Previous",
    next: "Next",
    slide: "Slide",
    map: "Map",
    placesOnMap: "Places on map",
    showOnMap: "Show on map",
    showAllPlaces: "Show all places",
    settingsSaved: "Settings saved",
    Move: "Open",
    legends: "Legends",
    price: "Price",
    company: "Company",
    moreDetails: "More Details",
    tourDetails: "Tour Details",
    backToTours: "Back to Tours",
    placesInThisTour: "Places in this tour",
    availableTours: "Available Tours",
    noTours: "No tours available",
    noToursForThisPlace: "No tours available for this place",
    errorLoadingTours: "Error loading tours",
    retry: "Retry",
    noImage: "No image",
    about: "About Us",
    phone: "Phone",
    instagram: "Instagram",
    russian: "Russian",
    english: "English",
    kazakh: "Kazakh",
    aboutDescription: "Apex Tourism is your gateway to exploring the magnificent Mangystau region. Our application is designed to help travelers discover the unique natural and cultural attractions of this beautiful area in Kazakhstan.",
    ourMission: "Our Mission",
    missionDescription: "We aim to promote sustainable tourism in Mangystau by providing detailed information about local attractions, creating awareness about the region's rich cultural heritage, and supporting local businesses and tour operators.",
    whatWeOffer: "What We Offer",
    offer1: "Comprehensive database of tourist attractions in Mangystau",
    offer2: "Detailed information about each location including history, legends, and photos",
    offer3: "Interactive map to help you navigate and explore the region",
    offer4: "Curated tours created by local experts",
    offer5: "Information about local culture, traditions, and customs",
    offer6: "User reviews and ratings to help you make informed decisions",
    whyChooseUs: "Why Choose Apex Tourism?",
    whyChooseUsDescription: "Our team combines local expertise with modern technology to provide you with the best possible travel experience. We work directly with local guides and tour operators to ensure authentic and memorable experiences for our visitors.",
    trustedCompanion: "Your trusted travel companion in Mangystau",
    // Company page translations
    companyAbout: "Mangystau Tour is a travel company specializing in organizing trips across Mangystau. We showcase the region's unique nature, historical and cultural landmarks, making your journey bright and unforgettable.",
    companyFounded: "Founded in 2015",
    companyAddress: "Aktau, Dostyk St., 45",
    companyServices: [
      "Mangystau tours",
      "Excursions to Sherkala, Bozzhyra, Tuzbair",
      "Steppe safari",
      "Camping and outdoor activities"
    ],
    // Authentication translations
    profile: "Profile",
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    enterFullName: "Enter your full name",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    noAccount: "No account?",
    haveAccount: "Already have an account?",
    register: "Register",
    loginAction: "Log In",
    profileUpdated: "Profile updated successfully",
    errorLoadingProfile: "Error loading profile",
    saveChanges: "Save Changes",
    saving: "Saving...",
    signingOut: "Signing out...",
    checkEmail: "Please check your email and confirm your email address.",
    fillAllFields: "Please fill in all fields",
    passwordMinLength: "Password must be at least 6 characters",
    signupSuccess: "Registration successful! Please check your email for confirmation.",
    confirmPassword: "Confirm Password",
    enterPasswordAgain: "Enter password again",
    // Application name translations
    appName: "Apex Tourism",
    // Instagram translation
    visitInstagram: "Visit Instagram",
    // 360° view translation
    view360: "360° View",
    // 360° view not available yet translation
    view360NotAvailable: "Not available yet",
    // Chat translations
    aiAssistant: "AI Assistant",
    queuePending: "Queue:",
    closeChat: "Close chat",
    typeMessage: "Type your message...",
    sendMessage: "Send message",
    send: "Send",
    chatError: "Sorry, I encountered an error. Please try again.",
    chatWelcomeMessage: "Write your question and I'll do my best to help!"
  },
  kz: {
    home: "Басты бет",
    categories: "Санаттар",
    places: "Орындар",
    tours: "Турлар",
    back: "Артқа",
    loading: "Жүктелуде...",
    error: "Жүктеу қатесі",
    noData: "Деректер жоқ",
    settings: "Баптаулар",
    language: "Тіл",
    theme: "Тақырып",
    darkTheme: "Қараңғы тақырып",
    lightTheme: "Ашық тақырып",
    fontSize: "Қаріп өлшемі",
    small: "Кішкентай",
    normal: "Қалыпты",
    large: "Үлкен",
    veryLarge: "Өте үлкен",
    save: "Сақтау",
    cancel: "Болдырмау",
    mainSettings: "Негізгі баптаулар",
    explore: "Манғыстаудағы туризм",
    selectCategory: "Орындарды көру үшін санатты таңдаңыз",
    details: "Толығырақ",
    search: "Орындарды іздеу",
    searchPlaceholder: "Орын атауын немесе сипаттамасын енгізіңіз...",
    searchResults: "Іздеу нәтижелері",
    noSearchResults: "Сұрауыңыз бойынша ештеңе табылмады",
    featuredPlaces: "Ұсынылатын орындар",
    previous: "Алдыңғы",
    next: "Келесі",
    slide: "Слайд",
    map: "Карта",
    placesOnMap: "Картадағы орындар",
    showOnMap: "Картада көрсету",
    showAllPlaces: "Барлық орындарды көрсету",
    settingsSaved: "Баптаулар сақталды",
    Move: "Ашу",
    legends: "Легендалар",
    price: "Бағасы",
    company: "Компания",
    moreDetails: "Толығырақ",
    tourDetails: "Тур туралы",
    backToTours: "Турларға қайта оралу",
    placesInThisTour: "Осы турдағы орындар",
    availableTours: "Қолжетімді турлар",
    noTours: "Қолжетімді турлар жоқ",
    noToursForThisPlace: "Осы орын үшін қолжетімді турлар жоқ",
    errorLoadingTours: "Турларды жүктеу қатесі",
    retry: "Қайталау",
    noImage: "Сурет жоқ",
    about: "Біз туралы",
    phone: "Телефон",
    instagram: "Инстаграм",
    russian: "Орыс тілі",
    english: "Ағылшын тілі",
    kazakh: "Қазақ тілі",
    aboutDescription: "Apex Tourism - Мангистау өңірін зерттеуге арналған негізгі қақпаныңыз. Біздің қолданба саяхатшыларға Қазақстанның осы ғажайып аймағының бірегей табиғи және мәдени көрнекті жерлерін ашуға көмектеседі.",
    ourMission: "Біздің миссиямыз",
    missionDescription: "Біз Мангистауда тұрақты туризмді насихаттау мақсатында жергілікті көрнекті жерлер туралы егжей-тегжейлі ақпарат беру, өңірдің бай мәдени мұрасы туралы хабардарлықты арттыру және жергілікті кәсіпкерлер мен туроператорларға қолдау көрсету мақсатында жұмыс істейміз.",
    whatWeOffer: "Біз ұсынатын мүмкіндіктер",
    offer1: "Мангистаудағы туристикалық көрнекті жерлердің толық дерекқоры",
    offer2: "Әрбір орынның тарихы, аңыздары және фотосуреттері туралы егжей-тегжейлі ақпарат",
    offer3: "Өңірде бағдарлауға және зерттеуге көмектесетін интерактивті карта",
    offer4: "Жергілікті мамандар жасаған турлар",
    offer5: "Жергілікті мәдениет, дәстүрлер және әдет-ғұрыптар туралы ақпарат",
    offer6: "Шешім қабылдауға көмектесетін пайдаланушы пікірлері мен рейтингтері",
    whyChooseUs: "Неліктен Apex Tourism таңдау керек?",
    whyChooseUsDescription: "Біздің команда жергілікті мамандықты заманауи технологиялармен ұштастырып, сізге ең жақсы саяхат әсерін қамтамасыз етеді. Біз жергілікті бағытшылар мен туроператорлармен тікелей жұмыс істеп, қонақтарымыз үшін шын және ұмыт ешірмейтін әсерлерді қамтамасыз етеміз.",
    trustedCompanion: "Мангистаудағы сенімді саяхат серігіңіз",
    // Company page translations
    companyAbout: "Mangystau Tour — Маңғыстау бойынша сапарларды ұйымдастыруға маманданған туристік компания. Біз аймақтың ерекше табиғатын, тарихи және мәдени орындарын көрсетеміз, демалысты жарқын әрі есте қаларлық етеміз.",
    companyFounded: "2015 жылы негізделген",
    companyAddress: "Ақтау қ., Достық көш., 45",
    companyServices: [
      "Маңғыстау турлары",
      "Шерқала, Бозжыра, Тұзбайыр экскурсиялары",
      "Дала сафариі",
      "Кемпинг және белсенді демалыс"
    ],
    // Authentication translations
    profile: "Профиль",
    login: "Кіру",
    signup: "Тіркелу",
    email: "Email",
    password: "Құпиясөз",
    fullName: "Толық аты",
    enterEmail: "Email енгізіңіз",
    enterPassword: "Құпиясөз енгізіңіз",
    enterFullName: "Толық атыңызды енгізіңіз",
    signIn: "Кіру",
    signUp: "Тіркелу",
    signOut: "Шығу",
    noAccount: "Тіркелгі жоқ па?",
    haveAccount: "Тіркеліңіз бар ма?",
    register: "Тіркелу",
    loginAction: "Кіру",
    profileUpdated: "Профиль сәтті жаңартылды",
    errorLoadingProfile: "Профильді жүктеу қатесі",
    saveChanges: "Өзгерістерді сақтау",
    saving: "Сақталуда...",
    signingOut: "Шығу...",
    checkEmail: "Электрондық поштаңызды тексеріп, мекенжайыңызды растаңыз.",
    fillAllFields: "Барлық өрістерді толтырыңыз",
    passwordMinLength: "Құпиясөз кемінде 6 таңбадан тұруы керек",
    signupSuccess: "Тіркеу сәтті өтті! Растау үшін электрондық поштаңызды тексеріңіз.",
    confirmPassword: "Құпиясөзді растау",
    enterPasswordAgain: "Құпиясөзді қайта енгізіңіз",
    // Application name translations
    appName: "Apex Tourism",
    // Instagram translation
    visitInstagram: "Instagram-ды қарастыру",
    // Chat translations
    aiAssistant: "ЖИ Көмекші",
    queuePending: "Кезек:",
    closeChat: "Чатты жабу",
    typeMessage: "Хабарламаңызды теріңіз...",
    sendMessage: "Хабарлама жіберу",
    send: "Жіберу",
    chatError: "Кешіріңіз, қате орын алды. Қайтадан көріңіз.",
    chatWelcomeMessage: "Сұрағыңызды жазыңыз, мен көмектесуге тырысамын!"
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app_language") || "ru";
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("app_language", newLanguage);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations];
    const translation = langTranslations[key as keyof typeof langTranslations];
    // Handle array translations (like companyServices)
    if (Array.isArray(translation)) {
      return translation.join(", ");
    }
    return translation || key;
  };

  // Функция для получения названия поля в зависимости от языка
  const getLocalizedField = (obj: any, fieldName: string) => {
    if (!obj) return "";
    const localizedField = `${fieldName}_${language}`;
    return obj[localizedField] || obj[`${fieldName}_ru`] || obj[`${fieldName}_en`] || obj[`${fieldName}_kz`] || "";
  };

  const value = {
    language,
    changeLanguage,
    t,
    getLocalizedField,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}