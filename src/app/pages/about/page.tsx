"use client";

import { useLanguage } from "../../../../contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link href="/pages/home" className="btn" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← {t("back")}
        </Link>
        <h1>{t("about") || "About Us"}</h1>
      </div>

      <div className="content" style={{ 
        background: 'var(--card)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--border)'
      }}>
        <h2>Apex Tourism</h2>
        
        <p style={{ lineHeight: 1.6, marginBottom: 24 }}>
          {t("aboutDescription") || "Apex Tourism is your gateway to exploring the magnificent Mangystau region. Our application is designed to help travelers discover the unique natural and cultural attractions of this beautiful area in Kazakhstan."}
        </p>

        <h3>{t("ourMission") || "Our Mission"}</h3>
        <p style={{ lineHeight: 1.6, marginBottom: 24 }}>
          {t("missionDescription") || "We aim to promote sustainable tourism in Mangystau by providing detailed information about local attractions, creating awareness about the region's rich cultural heritage, and supporting local businesses and tour operators."}
        </p>

        <h3>{t("whatWeOffer") || "What We Offer"}</h3>
        <ul style={{ lineHeight: 1.6, marginBottom: 24, paddingLeft: 20 }}>
          <li>{t("offer1") || "Comprehensive database of tourist attractions in Mangystau"}</li>
          <li>{t("offer2") || "Detailed information about each location including history, legends, and photos"}</li>
          <li>{t("offer3") || "Interactive map to help you navigate and explore the region"}</li>
          <li>{t("offer4") || "Curated tours created by local experts"}</li>
          <li>{t("offer5") || "Information about local culture, traditions, and customs"}</li>
          <li>{t("offer6") || "User reviews and ratings to help you make informed decisions"}</li>
        </ul>

        <h3>{t("whyChooseUs") || "Why Choose Apex Tourism?"}</h3>
        <p style={{ lineHeight: 1.6, marginBottom: 24 }}>
          {t("whyChooseUsDescription") || "Our team combines local expertise with modern technology to provide you with the best possible travel experience. We work directly with local guides and tour operators to ensure authentic and memorable experiences for our visitors."}
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.03)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <img 
            src="/favicon.ico" 
            alt="Apex Tourism Logo" 
            style={{ width: '64px', height: '64px' }}
          />
          <div>
            <h3 style={{ margin: 0 }}>Apex Tourism</h3>
            <p style={{ margin: '4px 0 0 0' }}>{t("trustedCompanion") || "Your trusted travel companion in Mangystau"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}