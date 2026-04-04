import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

const API_CATEGORIES = "http://localhost:3000/api/categories";
const API_PRODUCTS = "http://localhost:3000/api/products";

export const getCategories = async () => {
  const res = await axios.get(API_CATEGORIES);
  return res.data;
};

function ProductForm({ selectedProduct, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    description: "",
    categoryId: "",
    imageUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        description: selectedProduct.description || "",
        categoryId: selectedProduct.category?.id
          ? String(selectedProduct.category.id)
          : "",
        imageUrl: selectedProduct.imageUrl || "",
      });

      setPreview(selectedProduct.imageUrl || "");
    } else {
      setForm({
        nombre: "",
        precio: "",
        description: "",
        categoryId: "",
        imageUrl: "",
      });
      setPreview("");
    }
  }, [selectedProduct]);

  useEffect(() => {
  return () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  };
}, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "react_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dofso5z4f/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleImage = async (file) => {
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setCreatingCategory(true);

      const res = await axios.post(
        API_CATEGORIES,
        { name: newCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = await getCategories();
      setCategories(updated);

      setForm((prev) => ({
        ...prev,
        categoryId: String(res.data.id),
      }));

      setNewCategory("");
    } catch (error) {
      console.error(error);
      alert("Error creando categoría ❌");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("No hay sesión activa ❌");

    if(user?.role !== "admin") {
      return alert("No tienes permisos para realizar esta acción ❌");
    }

    if (!form.imageUrl) {
      return alert("La imagen es obligatoria ❌");
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl,
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (selectedProduct) {
        await axios.put(
          `${API_PRODUCTS}/${selectedProduct.id}`,
          payload,
          config
        );
      } else {
        await axios.post(API_PRODUCTS, payload, config);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al guardar ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{selectedProduct ? "Editar Producto" : "Nuevo Producto"}</h3>

      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
        step="0.01"
        required
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />

      <div
        className="image-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: "2px dashed #bbb",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        Arrastra una imagen o haz clic
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {uploading && <p>Subiendo imagen...</p>}

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "100%", marginBottom: 10 }}
        />
      )}

      <div className="create-category">
        <input
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          type="button"
          onClick={createCategory}
          disabled={creatingCategory}
        >
          {creatingCategory ? "Creando..." : "Agregar"}
        </button>
      </div>

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        required
      >
        <option value="">
          {loadingCategories ? "Cargando..." : "Selecciona una categoría"}
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}

export default ProductForm;