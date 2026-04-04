import { useEffect, useState } from "react";
import ProductForm from "../components/products/ProductForm";
import ProductList from "../components/products/ProductList";

function ProductsEdit() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [productImages, setProductImages] = useState(() => {
  const stored = localStorage.getItem("productImages");
  return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
  localStorage.setItem("productImages", JSON.stringify(productImages));
}, [productImages]);

  const handleSuccess = () => {
    setSelectedProduct(null);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="product-form-wrapper"> 
      <h2 className="title_h2">Gestión de Productos</h2>

      <ProductForm
        selectedProduct={selectedProduct}
        onSuccess={handleSuccess}
        productImages={productImages}
        setProductImages={setProductImages}
      />

      <hr />

      <ProductList
        refresh={refresh}
        onEdit={(product) => setSelectedProduct(product)}
        productImages={productImages}
        setProductImages={setProductImages}
      />
    </div>
  );
}

export default ProductsEdit;