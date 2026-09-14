Shopora 🛍️

A modern, premium e-commerce web application built with React + Vite, featuring product browsing, search, categories, authentication, cart management, checkout, and responsive UI.

✨ Features
🛍️ Browse products
🔎 Product search
🗂️ Category-based shopping
💰 Discount & offer section
⭐ Product ratings and reviews
🖼️ Product image gallery
🛒 Add to cart
➕➖ Cart quantity management
💳 Checkout experience
👤 User registration & login
💾 LocalStorage-based authentication
📦 Order summary
🌙 Dark / Light theme
📱 Responsive design
📞 Contact page
❌ Custom 404 page
🛠️ Tech Stack
React
Vite
React Router
JavaScript
CSS / Inline Styling
DummyJSON API
LocalStorage
📡 API

Shopora currently uses the DummyJSON API for product data.

Main endpoints include:

Products
Product search
Categories
Category products
Individual product details
🚀 Getting Started

Clone the repository:

git clone https://github.com/aakib-0101/shopora-ecommerce.git

Go into the project:

cd shopora-ecommerce

Install dependencies:

npm install

Start the development server:

npm run dev

Then open the local URL shown in your terminal.

📁 Project Structure
src/
├── components/
│   └── Navbar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── CategoryProducts.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
│
├── App.jsx
├── index.css
└── main.jsx
🔐 Authentication

For the current frontend version, registration and login are handled using browser LocalStorage.

This is intended for demonstration/development purposes and is not a production authentication system.

🛒 Cart

Cart data is persisted in LocalStorage, allowing products and quantities to remain available after refreshing the page.

📌 Future Improvements
Backend integration
Real authentication
Database
Payment gateway
Order history
Wishlist
Admin dashboard
Product reviews
User profile editing
Production-grade security
👨‍💻 Author

Aakib