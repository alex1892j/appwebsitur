import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const API_CATEGORIES = "http://localhost:3000/api/categories";

// Sub-componente para cada fila de productos
const CategoryRow = ({ category }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const products = category.products || [];

  const minSwipeDistance = 50;

  if (products.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const handleReservar = (product) => {
    const { description, ...productoSinDescripcion } = product;
    navigate("/appointment", { 
      state: { producto: productoSinDescripcion } 
    });
  };

  return (
    <article className="category-group">
      <h2 className="category-title">{category.name}</h2>
      
      <div
        className="carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="nav-arrow left" onClick={prevSlide}>❮</button>
        
        <div className="carousel-track">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`product-card ${index === currentIndex ? "active" : ""}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div className="card-inner">
                <div className="image-box">
                  <img src={product.imageUrl} alt={product.nombre} loading="lazy" />
                  <span className="price-badge">S/ {product.precio}</span>
                </div>
                <div className="info-box">
                  <h3>{product.nombre}</h3>
                  <p>{product.description || "Servicio profesional de alta calidad."}</p>
                  <button
                   className="btn-reservar"
                   onClick={() => handleReservar(product)}
                  >Reservar Ahora</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="nav-arrow right" onClick={nextSlide}>❯</button>
      </div>

      <div className="dots-group">
        {products.map((_, i) => (
          <span 
            key={i} 
            className={`dot ${currentIndex === i ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </article>
  );
};

export default function Carousel() {
  const { loadingUser, token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingUser) return;

    const fetchCategories = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(API_CATEGORIES, config);
        setCategories(res.data);
      } catch (err) {
        console.error("Error Carousel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [loadingUser, token]);

  if (loadingUser || loading) return <div className="loader">Cargando servicios...</div>;

  return (
    <section className="main-services-view">
      {categories.map(cat => (
        <CategoryRow key={cat.id} category={cat} />
      ))}
    </section>
  );
}