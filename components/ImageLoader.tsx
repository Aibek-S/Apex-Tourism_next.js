import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any;
}

export default function ImageLoader({ src, alt, className, style, onError, ...props }: ImageLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    setError(true);
    if (onError) onError(e);
  };

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--card)',
              borderRadius: (style?.borderRadius as string) || '0',
              zIndex: 1
            }}
          >
            <div className="loading-spinner" style={{
              width: '30px',
              height: '30px',
              border: '3px solid rgba(0,0,0,0.1)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--card)',
              borderRadius: (style?.borderRadius as string) || '0'
            }}
          >
            <span className="muted">Image not available</span>
          </motion.div>
        ) : (
          <motion.img
            {...props}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              opacity: loading ? 0 : 1,
              transition: 'opacity 0.3s ease',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...props.style
            }}
          />
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}