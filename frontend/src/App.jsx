import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Appointment from "./pages/Appointment";
import ProductsEdit from "./pages/ProductsEdit";

import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>
    
      <Route
        path="/"
        element={
            <AppLayout>
              <Home />
            </AppLayout>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Products />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Appointment />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/productsEdit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProductsEdit />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

