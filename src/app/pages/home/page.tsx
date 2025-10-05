"use client";

import { useLanguage } from "../../../../contexts/LanguageContext";
import SearchSection from "../../../../components/SearchSection";
import PlaceSlider from "../../../../components/PlaceSlider";
import CategoryList from "../../../../components/CategoryList";
import { motion } from "framer-motion";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="app-main">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Секция поиска */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <SearchSection />
        </motion.div>

        {/* Слайдер с рекомендуемыми местами */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <PlaceSlider />
        </motion.div>

        {/* Разделитель */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            borderTop: "1px solid var(--border)",
            margin: "32px 0",
            paddingTop: "32px",
          }}
        >
          {/* Список категорий */}
          <CategoryList />
        </motion.div>
      </motion.div>
    </div>
  );
}