"use client";

import { useState, useEffect } from "react";
import AnimatedButton from "../../../../components/AnimatedButton";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { supabase } from "../../../../lib/supabase";
import { useLanguage } from "../../../../contexts/LanguageContext";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    // Load user profile from Supabase
    useEffect(() => {
        if (user) {
            loadProfile();
            setEmail(user.email || "");
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            if (!user) return;
            
            const { data, error } = await supabase
                .from("users")
                .select("full_name")
                .eq("id", user.id)
                .single();

            if (error) throw error;

            if (data) {
                setFullName(data.full_name || "");
            }
        } catch (error: any) {
            console.error("Error loading profile:", error);
            setError(t("errorLoadingProfile"));
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOut();
            router.push("/pages/login");
        } catch (error: any) {
            console.error("Error signing out:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            if (!user) return;
            
            const { error } = await supabase.from("users").upsert({
                id: user.id,
                full_name: fullName,
                updated_at: new Date(),
            });

            if (error) throw error;

            setMessage(t("profileUpdated"));
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="auth-container">
                <div className="auth-form">
                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px",
                        }}
                    >
                        {t("loading")}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>{t("profile")}</h2>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <div>
                    <div className="profile-info">
                        <form
                            onSubmit={handleUpdateProfile}
                            className="profile-form"
                        >
                            <div className="profile-form-group">
                                <label
                                    htmlFor="fullName"
                                    className="profile-form-label"
                                >
                                    {t("fullName")}
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    placeholder={t("enterFullName")}
                                    className="profile-form-input"
                                />
                            </div>
                            <div className="profile-form-group">
                                <label
                                    htmlFor="email"
                                    className="profile-form-label"
                                >
                                    {t("email")}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("enterEmail")}
                                    className="profile-form-input"
                                    disabled
                                />
                            </div>
                            <AnimatedButton
                                type="submit"
                                disabled={loading}
                                className="profile-submit-button"
                            >
                                {loading
                                    ? t("saving")
                                    : t("saveChanges")}
                            </AnimatedButton>
                        </form>
                    </div>
                </div>
                <AnimatedButton
                    onClick={handleSignOut}
                    disabled={loading}
                    className="signout-button"
                >
                    {loading ? t("signingOut") : t("signOut")}
                </AnimatedButton>
            </div>
        </div>
    );
}