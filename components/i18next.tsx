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
      "Create Group": "Guruh yaratish",
      "Group Name": "Guruh nomi",
      "Teacher": "O'qituvchi",
      "Select a Teacher": "O'qituvchini tanlang",
      "Education Form": "Ta'lim shakli",
      "Daytime": "Kunduzgi",
      "Evening": "Kechki",
      "Remote": "Masofaviy",
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
      "Create Group": "Создать группу",
      "Group Name": "Название группы",
      "Teacher": "Учитель",
      "Select a Teacher": "Выберите учителя",
      "Education Form": "Форма обучения",
      "Daytime": "Дневное",
      "Evening": "Вечернее",
      "Remote": "Дистанционное",
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
      "Create Group": "Create Group",
      "Group Name": "Group Name",
      "Teacher": "Teacher",
      "Select a Teacher": "Select a Teacher",
      "Education Form": "Education Form",
      "Daytime": "Daytime",
      "Evening": "Evening",
      "Remote": "Remote",
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
