import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "@/pages/Index";
import Catalogo from "@/pages/Catalogo";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Contato from "@/pages/Contato";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import Quotes from "@/pages/admin/Quotes";
import Products from "@/pages/admin/Products";
import Suppliers from "@/pages/admin/Suppliers";
import Users from "@/pages/admin/Users";
import Customers from "@/pages/admin/Customers";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/produtos" element={<Navigate to="/catalogo" replace />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <AdminRoute>
              <Quotes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/quotes"
          element={<Navigate to="/admin/pedidos" replace />}
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/suppliers"
          element={
            <AdminRoute>
              <Suppliers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <Customers />
            </AdminRoute>
          }
        />

        {/* Seller Routes - Redirect to admin */}
        <Route path="/vendedor" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Legacy routes - Redirect */}
        <Route path="/orcamentos" element={<Navigate to="/catalogo" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;