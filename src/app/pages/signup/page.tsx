"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { motion } from "framer-motion";
import AnimatedButton from "../../../../components/AnimatedButton";
import { useLanguage } from "../../../../contexts/LanguageContext";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { signUp } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!email || !password || !fullName) {
            setError(t("fillAllFields"));
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t("passwordMinLength"));
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await signUp(email, password, {
                data: { full_name: fullName },
            });

            if (error) throw error;

            setMessage(t("signupSuccess"));
            setEmail("");
            setPassword("");
            setFullName("");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-main">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                <motion.div
                    className="auth-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    <h2>{t("signup")}</h2>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">{t("fullName")}</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={t("enterFullName")}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t("email")}</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("enterEmail")}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t("password")}</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("enterPassword")}
                            />
                        </div>

                        <AnimatedButton
                            type="submit"
                            disabled={loading}
                            className="btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {loading ? `${t("signUp")}...` : t("signUp")}
                        </AnimatedButton>
                    </form>

                    <div className="auth-links">
                        <p>
                            {t("haveAccount")} <Link href="/pages/login">{t("loginAction")}</Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}