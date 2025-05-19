import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsAdmin from './pages/ProductsAdmin';
import OrdersAdmin from './pages/OrdersAdmin';
import UsersAdmin from './pages/UsersAdmin';
import CategoriesAdmin from './pages/CategoriesAdmin';
import Navbar from './components/Navbar';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/categories" element={<CategoriesAdmin />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;