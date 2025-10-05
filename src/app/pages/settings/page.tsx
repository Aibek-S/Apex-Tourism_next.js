"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../../contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedButton from "../../../../components/AnimatedButton";

export default function SettingsPage() {
    const { language, changeLanguage, t } = useLanguage();
    const router = useRouter();

    const [theme, setTheme] = useState("dark");
    const [fontSize, setFontSize] = useState("16");

    // Read saved settings on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("app_theme") || "dark";
        const savedFontSize = localStorage.getItem("app_font_size") || "16";
        setTheme(savedTheme);
        setFontSize(savedFontSize);
    }, []);

    // Apply theme by changing body class
    const applyTheme = (value: string) => {
        if (value === "light") {
            document.body.classList.add("theme-light");
        } else {
            document.body.classList.remove("theme-light");
        }
    };

    // Apply font size through root variable
    const applyFontSize = (value: string) => {
        document.documentElement.style.setProperty(
            "--base-font-size",
            `${value}px`
        );
    };

    // Settings save handler
    const saveSettings = () => {
        localStorage.setItem("app_theme", theme);
        localStorage.setItem("app_font_size", fontSize);
        applyTheme(theme);
        applyFontSize(fontSize);
        alert(t("settingsSaved"));
        router.back(); // Go back to previous page
    };

    // Language change handler
    const handleLanguageChange = (newLanguage: string) => {
        changeLanguage(newLanguage);
    };

    // Get language name for display
    const getLanguageName = (langCode: string) => {
        const languages: { [key: string]: string } = {
            ru: t("russian"),
            en: t("english"),
            kz: t("kazakh"),
        };
        return languages[langCode] || langCode;
    };

    // Get theme name for display
    const getThemeName = (themeValue: string) => {
        return themeValue === "light" ? t("lightTheme") : t("darkTheme");
    };

    // Get font size description
    const getFontSizeDescription = (size: string) => {
        const sizes: { [key: string]: string } = {
            "14": t("small"),
            "16": t("normal"),
            "18": t("large"),
            "20": t("veryLarge"),
        };
        return sizes[size] || `${size}px`;
    };

    return (
        <div className="app-main">
            <motion.div
                className="settings-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                <motion.div
                    className="settings-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    <div className="settings-header">
                        <h2>{t("settings")}</h2>
                        <AnimatedButton
                            className="icon-btn"
                            onClick={() => router.back()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {t("back")}
                        </AnimatedButton>
                    </div>

                    <div className="settings-content">
                        <div className="settings-section">
                            <div className="settings-card">
                                <h3>{t("mainSettings")}</h3>
                                <div className="settings-row">
                                    <div className="form-group">
                                        <label htmlFor="language">
                                            {t("language")}
                                        </label>
                                        <select
                                            id="language"
                                            value={language}
                                            onChange={(e) =>
                                                handleLanguageChange(e.target.value)
                                            }
                                            className="settings-select"
                                        >
                                            <option value="ru">{t("russian")}</option>
                                            <option value="en">{t("english")}</option>
                                            <option value="kz">{t("kazakh")}</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="theme">{t("theme")}</label>
                                        <select
                                            id="theme"
                                            value={theme}
                                            onChange={(e) =>
                                                setTheme(e.target.value)
                                            }
                                            className="settings-select"
                                        >
                                            <option value="dark">
                                                {t("darkTheme")}
                                            </option>
                                            <option value="light">{t("lightTheme")}</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="font">
                                            {t("fontSize")}
                                        </label>
                                        <select
                                            id="font"
                                            value={fontSize}
                                            onChange={(e) =>
                                                setFontSize(e.target.value)
                                            }
                                            className="settings-select"
                                        >
                                            <option value="14">{t("small")}</option>
                                            <option value="16">{t("normal")}</option>
                                            <option value="18">{t("large")}</option>
                                            <option value="20">
                                                {t("veryLarge")}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-footer">
                        <AnimatedButton
                            className="btn"
                            onClick={saveSettings}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {t("save")}
                        </AnimatedButton>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}