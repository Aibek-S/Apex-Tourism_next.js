"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategories } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";

export default function CategoryList() {
  const { categories, loading, error, refetch } = useCategories();
  const { t, getLocalizedField } = useLanguage();

  // Listen for refresh event
  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener('refreshHomePage', handleRefresh);
    return () => {
      window.removeEventListener('refreshHomePage', handleRefresh);
    };
  }, [refetch]);

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <p className="muted">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <p className="muted" style={{ color: "var(--primary)" }}>
          {t("error")}: {error}
        </p>
      </div>
    );
  }

  // Handle case where categories is null or undefined
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <div
        className="no-data-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <p className="muted">{t("noData")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{t("categories")}</h2>
      <p className="muted" style={{ marginBottom: 24 }}>
        {t("selectCategory")}
      </p>
      <div className="grid" style={{ marginTop: 12 }}>
        {categories.map((category, index) => (
          <article 
            key={category.id} 
            className="card card-hover"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="content">
              <h3 style={{ marginBottom: 16 }}>{getLocalizedField(category, "name")}</h3>
              <Link className="btn scale-hover" href={`/pages/categories/${category.id}`} >
                {t("Move")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}