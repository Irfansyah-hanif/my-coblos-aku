import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Jika gambar masuk viewport, mulai load
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {/* 1. Placeholder Blur (Selalu ada sampai gambar asli load) */}
      <div 
        className={`absolute inset-0 bg-slate-300 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }} // Efek blur
      />
      
      {/* 2. Gambar Asli (Hanya dirender jika isInView) */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy" // HTML5 Lazy load attribute
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}