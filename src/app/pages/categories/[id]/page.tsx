"use client";

import { useParams, useRouter } from "next/navigation";
import { usePlaces, useCategories } from "../../../../../hooks/useSupabase";
import { useLanguage } from "../../../../../contexts/LanguageContext";
import PlaceCard from "../../../../../components/PlaceCard";
import Link from "next/link";

export default function PlaceList() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { places, loading: placesLoading, error: placesError } = usePlaces(id);
  const { categories, loading: categoriesLoading } = useCategories();
  const { t, getLocalizedField } = useLanguage();

  const category = categories.find((cat: any) => cat.id === parseInt(id));

  if (placesLoading || categoriesLoading) {
    return (
      <div className="app-main">
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
      </div>
    );
  }

  if (placesError) {
    return (
      <div className="app-main">
        <div
          className="error-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            gap: 16,
          }}
        >
          <p className="muted" style={{ color: "var(--primary)" }}>
            {t("error")}: {placesError}
          </p>
          <Link className="btn" href="/pages/home">
            {t("back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div style={{ marginBottom: 24 }}>
        <Link
          className="btn"
          href="/pages/home"
          style={{ marginBottom: 16, display: "inline-block" }}
        >
          ← {t("back")}
        </Link>
        <h2>{category ? getLocalizedField(category, "name") : t("places")}</h2>
      </div>

      {!places.length ? (
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
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {places.map((place: any, index: number) => (
            <div key={place.id}>
              <PlaceCard place={place} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}