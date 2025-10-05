"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import AnimatedButton from "../../../components/AnimatedButton";
import { useLanguage } from "../../../contexts/LanguageContext";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // New state for success messages
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth(); // Removed signInWithGoogle from destructuring
    const router = useRouter();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage(""); // Clear any previous message

        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            router.push("/home");
        } catch (err: any) {
            // Check if it's an email confirmation error
            if (err.message.includes("Email not confirmed")) {
                setMessage(t("checkEmail"));
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Removed handleGoogleSignIn function

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
                    <h2>{t("login")}</h2>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">{t("email")}</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("enterEmail")}
                                required
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
                                required
                            />
                        </div>

                        <AnimatedButton
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {loading ? `${t("signIn")}...` : t("signIn")}
                        </AnimatedButton>
                    </form>

                    {/* Removed Google login button and divider */}

                    <div className="auth-links">
                        <p>
                            {t("noAccount")}{" "}
                            <Link href="/signup">{t("register")}</Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}