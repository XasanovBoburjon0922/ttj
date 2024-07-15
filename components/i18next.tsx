// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uzb: {
    translation: {
      "Home": "Bosh sahifa",
      "Settings": "Sozlamalar",
      "Attendance Records": "Davomatlar",
      "Groups": "Guruhlar",
      "Statistics": "Statistika",
      "Applications": "Arizalar",
      "Attendance": "Yo'qlama",
      "Logout": "Chiqish",
      "Username": "Foydalanuvchi",
    },
  },
  rus: {
    translation: {
      "Home": "Главная",
      "Settings": "Настройки",
      "Attendance Records": "Посещаемость",
      "Groups": "Группы",
      "Statistics": "Статистика",
      "Applications": "Заявления",
      "Attendance": "Посещаемость",
      "Logout": "Выход",
      "Username": "Пользователь",
    },
  },
  eng: {
    translation: {
      "Home": "Home",
      "Settings": "Settings",
      "Attendance Records": "Attendance Records",
      "Groups": "Groups",
      "Statistics": "Statistics",
      "Applications": "Applications",
      "Attendance": "Attendance",
      "Logout": "Logout",
      "Username": "Username",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uzb', // default language
    fallbackLng: 'uzb',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
