import React from 'react'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import CategoryProducts from './pages/CategoryProducts.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/Navbar.jsx'
import Contact from './pages/Contact.jsx'
import { Routes, Route, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

// Parent layout wrapper for shop/catalog sections if needed
const ShopLayout = () => {
  return <Outlet />
}

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* Home Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

       <Route path="/products" element={<ShopLayout />}>
  {/* /products */}
  <Route index element={<Shop />} />

  {/* /products/beauty */}
  <Route path=":category" element={<CategoryProducts />} />
</Route>
        {/* Dynamic Individual Product View (e.g., /products/123) */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Cart & Checkout Flow */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* User Account / Profile */}
        <Route path="/profile" element={<Profile />} />

      </Route>
<Route path="/contact" element={<Contact />} />
      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App