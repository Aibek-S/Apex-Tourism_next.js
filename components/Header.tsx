"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  // Языковой контекст
  const { language, changeLanguage, t } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();

  // Локальное состояние настроек
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("16");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Читаем сохранённые настройки при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme") || "dark";
    const savedFontSize = localStorage.getItem("app_font_size") || "16";
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
  }, []);

  // Применяем тему, меняя класс на body
  const applyTheme = (value: string) => {
    if (value === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  };

  // Применяем размер шрифта через корневую переменную
  const applyFontSize = (value: string) => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${value}px`
    );
  };

  // Обработчик смены языка
  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
  };
  
  // Обработчик для предотвращения закрытия меню при клике внутри
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Обработчик для закрытия меню при клике вне его
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Добавляем/удаляем класс при открытии/закрытии меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-nav-open');
      document.addEventListener('click', handleOutsideClick as any);
      // Предотвращаем прокрутку фона при открытом меню
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('click', handleOutsideClick as any);
      // Восстанавливаем прокрутку
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('click', handleOutsideClick as any);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  return (
    // Контейнер шапки
    <header className="site-header">
      <div className="inner">
        {/* Логотип/название — ссылка на главную */}
        <Link href="/pages/home" style={{ textDecoration: "none", color: "inherit" }}>
          <strong>{t("appName")}</strong>
        </Link>
        
        {/* Гамбургер меню для мобильных устройств */}
        <div 
          className="mobile-menu-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Навигация для десктопа */}
        <nav className="desktop-nav">
          <Link href="/pages/tours" className={pathname === "/pages/tours" ? "active" : ""}>{t("tours") || "Tours"}</Link>
          <Link href="/pages/map" className={pathname === "/pages/map" ? "active" : ""}>{t("map") || "Карта"}</Link>
          {user ? (
            <Link href="/pages/profile" className={pathname === "/pages/profile" ? "active" : ""}>{t("profile")}</Link>
          ) : (
            <>
              <Link href="/pages/login" className={pathname === "/pages/login" ? "active" : ""}>{t("login")}</Link>
              <Link href="/pages/signup" className={pathname === "/pages/signup" ? "active" : ""}>{t("signup")}</Link>
            </>
          )}
          <Link href="/pages/settings" className={pathname === "/pages/settings" ? "active" : ""}>{t("settings")}</Link>
          <Link href="/pages/chat" className={pathname === "/pages/chat" ? "active" : ""}>{t("aiAssistant")}</Link>
        </nav>
        
        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <nav 
            className="mobile-nav"
            onClick={handleMenuClick}
          >
            <Link href="/pages/home" onClick={() => setMobileMenuOpen(false)}>{t("home")}</Link>
            <Link href="/pages/tours" onClick={() => setMobileMenuOpen(false)}>{t("tours") || "Tours"}</Link>
            <Link href="/pages/map" onClick={() => setMobileMenuOpen(false)}>{t("map") || "Карта"}</Link>
            {user ? (
              <Link href="/pages/profile" onClick={() => setMobileMenuOpen(false)}>{t("profile")}</Link>
            ) : (
              <>
                <Link href="/pages/login" onClick={() => setMobileMenuOpen(false)}>{t("login")}</Link>
                <Link href="/pages/signup" onClick={() => setMobileMenuOpen(false)}>{t("signup")}</Link>
              </>
            )}
            <Link href="/pages/settings" onClick={() => setMobileMenuOpen(false)}>{t("settings")}</Link>
            <Link href="/pages/chat" onClick={() => setMobileMenuOpen(false)}>{t("aiAssistant")}</Link>
          </nav>
        )}
      </div>
    </header>
  );
}