import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth.jsx";
import ConfirmModal from "../modal/ConfirmModal.jsx";
import AlertModal from "../modal/AlertModal.jsx";
 

const API_PRODUCTS = "http://localhost:3000/api/products";
const API_CATEGORIES = "http://localhost:3000/api/categories";

function ProductList({ refresh, onEdit }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Estados para Modales
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", message: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContent, setConfirmContent] = useState({});
//Estados para Slider de categorías
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [direction, setDirection] = useState("next");

  const categoryScrollRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          axios.get(API_PRODUCTS),
          axios.get(API_CATEGORIES)
        ]);
        setProducts(resProd.data);
        setCategories(resCat.data);
        if (resCat.data.length > 0 && !selectedCategory) {
          setSelectedCategory(resCat.data[0]);
        }
      } catch (error) {
        showAlert("Error", "No se pudieron cargar los datos");
      }
    };
    fetchData();
  }, [refresh]);

  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    setAlertOpen(true);
  };

  // Función para mover Slider de categorías
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
  setTouchEnd(null);
  setTouchStart(e.targetTouches[0].clientX);
};

const onTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > minSwipeDistance;
  const isRightSwipe = distance < -minSwipeDistance;

  if (isLeftSwipe) {
    moveSlider("right");
  } else if (isRightSwipe) {
    moveSlider("left");
  }
};


 const moveSlider = (direction) => {
  if (categories.length === 0) return;
  setDirection(direction === "right" ? "next" : "prev");
  let newIndex = currentIndex;
  if (direction === "left") {
    newIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
  } else {
    newIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1;
  }
  
  setCurrentIndex(newIndex);
  setSelectedCategory(categories[newIndex]);
};
//funcion para eliminar producto
  const askDeleteProduct = (productId) => {
    setConfirmContent({
      title: "Eliminar producto",
      message: "¿Estás seguro de eliminar este producto?",
      danger: true,
      onConfirm: () => deleteProduct(productId),
    });
    setConfirmOpen(true);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_PRODUCTS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (previewProduct?.id === id) setPreviewProduct(null);
    } catch (error) {
      showAlert("Error", "No se pudo eliminar el producto");
    } finally {
      setConfirmOpen(false);
    }
  };

  const askDeleteCategory = (categoryId) => {
    const hasProducts = products.some(p => p.category?.id === categoryId);
    if (hasProducts) {
      return showAlert("No permitido", "La categoría tiene productos asociados");
    }
    setConfirmContent({
      title: "Eliminar categoría",
      message: "¿Deseas eliminar esta categoría?",
      danger: true,
      onConfirm: () => deleteCategory(categoryId),
    });
    setConfirmOpen(true);
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_CATEGORIES}/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      if (selectedCategory?.id === categoryId) setSelectedCategory(null);
    } catch (error) {
      showAlert("Error", "Error al eliminar la categoría");
    } finally {
      setConfirmOpen(false);
    }
  };

  const filteredProducts = products.filter(
    (p) => p.category?.id === selectedCategory?.id
  );

  useEffect(() => {
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0]);
    setCurrentIndex(0);
  }
}, [categories]);

  return (
    <section className="admin-products-mobile">
     <div 
      className={`category-slider direction-${direction}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      >
      <button type="button" onClick={() => moveSlider("left")} className="btn-nav">‹</button>
      
      <div className="slider-content">
        {categories.map((cat, index) => (
          <div 
            key={cat.id} 
            className={`chip-slide ${index === currentIndex ? "active" : ""}`}
          >
            <span className="category-item">
              {cat.name}
            </span>
            <button 
              type="button" 
              className="btn-del-cat" 
              onClick={(e) => {
                e.stopPropagation(); 
                askDeleteCategory(cat.id)
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => moveSlider("right")} className="btn-nav">›</button>
    </div>

      <div className="table-container">
        <div className="table-header-grid">
          <span>IMG</span><span>NOMBRE</span><span>S/</span><span>ACCIONES</span>
        </div>
        <div className="table-body-scroll">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="table-row-grid">
              <div className="cell-img"><img src={prod.imageUrl} alt={prod.nombre} /></div>
              <div className="cell-name">{prod.nombre}</div>
              <div className="cell-price">{prod.precio}</div>
              <div className="cell-actions">
                <button type="button" onClick={() => onEdit(prod)} className="btn-edit">✎</button>
                <button type="button" onClick={() => askDeleteProduct(prod.id)} className="btn-delete">✖</button>
                <button type="button" onClick={() => setPreviewProduct(prod)} className="btn-view">👁</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-zone">
        {previewProduct ? (
          <article className="card-preview">
            <div className="card-image"><img src={previewProduct.imageUrl} alt="prev" /></div>
            <div className="card-content">
              <h4>{previewProduct.nombre}</h4>
              <p className="price">S/ {previewProduct.precio}</p>
              <p className="description">{previewProduct.description || "Sin descripción."}</p>
            </div>
          </article>
        ) : (
          <div className="card-empty">Toca 👁 para ver detalles</div>
        )}
      </div>

      <AlertModal 
        open={alertOpen} 
        title={alertContent.title} 
        message={alertContent.message} 
        onClose={() => setAlertOpen(false)} 
      />
      <ConfirmModal 
        open={confirmOpen} 
        title={confirmContent.title} 
        message={confirmContent.message} 
        danger={confirmContent.danger}
        onConfirm={confirmContent.onConfirm}
        onCancel={() => setConfirmOpen(false)} 
      />
    </section>
  );
}

export default ProductList;
