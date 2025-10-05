"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSearchParams } from 'next/navigation';
import L from 'leaflet';
import { useMapPlaces, getImageUrl } from "../../../../hooks/useSupabase";
import { useLanguage } from "../../../../contexts/LanguageContext";
import ImageLoader from "../../../../components/ImageLoader";
import { motion } from "framer-motion";
import Link from "next/link";
import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

// Импорт стилей Leaflet
import 'leaflet/dist/leaflet.css';

// Фикс иконок Leaflet в Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Создание кастомной иконки маркера - единый стиль для всех мест
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker primary-color',
    html: `<div class="marker-pin">
             <div class="marker-icon">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
               </svg>
             </div>
           </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

// Создание кастомной иконки маркера для выделенного места
const createHighlightedIcon = () => {
  return L.divIcon({
    className: 'custom-marker highlighted',
    html: `<div class="marker-pin">
             <div class="marker-icon">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
               </svg>
             </div>
           </div>`,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
  });
};

// Настройка иконок маркеров
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapPage() {
  const { places, loading, error } = useMapPlaces();
  const { language, getLocalizedField, t } = useLanguage();
  const searchParams = useSearchParams();
  const mapRef = useRef<any>(null);
  
  // Получаем ID места из параметров URL
  const placeId = searchParams ? searchParams.get('place') : null;
  
  // Границы региона Мангистау (расширены для лучшей видимости)
  const mangistauBounds: LatLngBoundsExpression = useMemo(() => [
    [41.0, 49.0], // юго-западный угол (расширены границы)
    [47.5, 57.0]  // северо-восточный угол (расширены границы)
  ], []);

  // Центр карты (примерно центр Мангистау)
  const mapCenter: LatLngExpression = useMemo(() => [44.3, 53.0], []);

  // Фокус на конкретном месте, если указано
  useEffect(() => {
    if (placeId && mapRef.current && places.length > 0) {
      const place = places.find(p => p.id === parseInt(placeId));
      if (place && place.lat && place.lng) {
        mapRef.current.setView([place.lat, place.lng], 13);
      }
    }
  }, [placeId, places]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#2a1f1a'
      }}>
        {t('loading') || 'Загрузка карты...'}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <p style={{ color: '#c49a6c', fontSize: '18px' }}>
          {t('error')}: {error.toString()}
        </p>
        <Link href="/pages/home" className="btn">
          {t('back') || 'На главную'}
        </Link>
      </div>
    );
  }

  // Функция получения имени места на текущем языке
  const getPlaceName = (place: any) => {
    return getLocalizedField(place, 'name');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ 
        height: '100vh', 
        width: '100%',
        backgroundColor: '#1a1a1a' // Темный фон для лучшей контрастности со спутниковой картой
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={9} // Увеличенный начальный zoom для лучшей видимости
        style={{ height: '100%', width: '100%' }}
        maxBounds={mangistauBounds}
        maxBoundsViscosity={1.0}
        minZoom={6} // Уменьшен минимальный zoom для большей гибкости
        maxZoom={17} // Увеличен максимальный zoom для более детального просмотра
        ref={mapRef}
      >
        {/* Используем только одну спутниковую карту - Esri World Imagery */}
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Маркеры мест */}
        {places.map((place: any) => {
          // Проверяем наличие координат
          if (!place.lat || !place.lng) return null;

          // Используем выделенную иконку для указанного места
          const isHighlighted = placeId && place.id === parseInt(placeId);
          const markerIcon = isHighlighted ? createHighlightedIcon() : createCustomIcon();

          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={markerIcon}
            >
              <Popup
                maxWidth={300}
                className="custom-popup" // Убираем зависимость от темы
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{ 
                    padding: '8px',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff', // Фиксированный цвет фона
                    color: '#2a1f1a' // Фиксированный цвет текста
                  }}
                >
                  {/* Название места */}
                  <h3 style={{ 
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2a1f1a' // Фиксированный цвет текста
                  }}>
                    {getPlaceName(place)}
                  </h3>

                  {/* Категория */}
                  {place.categories && (
                    <p style={{ 
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      color: '#6b5a4c', // Фиксированный цвет текста
                      fontStyle: 'italic'
                    }}>
                      {getLocalizedField(place.categories, 'name')}
                    </p>
                  )}

                  {/* Изображение */}
                  {(place.place_photos && place.place_photos.length > 0) ? (
                    <div style={{ marginBottom: '12px', height: '150px' }}>
                      <ImageLoader
                        src={place.place_photos[0].url}
                        alt={getPlaceName(place)}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          border: '1px solid #d9cfc6' // Фиксированный цвет границы
                        }}
                      />
                    </div>
                  ) : place.image && (
                    <div style={{ marginBottom: '12px', height: '150px' }}>
                      <ImageLoader
                        src={getImageUrl(place.image) || ''}
                        alt={getPlaceName(place)}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          border: '1px solid #d9cfc6' // Фиксированный цвет границы
                        }}
                      />
                    </div>
                  )}

                  {/* Кнопка "Подробнее" */}
                  <Link
                    href={`/pages/places/${place.id}`}
                    className="btn scale-hover"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#c49a6c', // Фиксированный цвет фона
                      color: '#1a120b', // Фиксированный цвет текста
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {t('details') || 'Подробнее'}
                  </Link>
                </motion.div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Информация о количестве мест */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute',
          top: '80px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)', // Полупрозрачный темный фон
          border: '1px solid #ffffff',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          color: '#ffffff', // Белый текст для лучшей видимости на спутниковой карте
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {t('placesOnMap') || 'Мест на карте'}: {places.length}
      </motion.div>
      
      {/* Кнопка возврата к обзору карты */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute',
          top: '80px',
          left: '10px',
          zIndex: 1000
        }}
      >
        <Link
          href="/pages/map"
          className="btn scale-hover"
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Полупрозрачный темный фон
            color: '#ffffff', // Белый текст
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {t('showAllPlaces') || 'Показать все места'}
        </Link>
      </motion.div>
    </motion.div>
  );
}