# CopyCraft AI

CopyCraft AI is a simple full-stack web application that helps users generate and manage ecommerce product descriptions using AI.
The app allows users to create products, generate AI-powered descriptions, store them in a database, and edit or delete them later.

This project was built as part of the **“Vibe to Product” challenge**, demonstrating the ability to rapidly build a functional product using modern tools and AI-assisted development.

---

# Features

* Create new product entries
* Generate AI product descriptions
* Store products in a database
* Edit existing products
* Delete products
* Responsive React interface
* AI text generation powered by the **Google Gemini API**

---

# Tech Stack

Frontend

* React
* Vite
* Tailwind CSS

Backend

* Node.js
* Express.js

Database

* Prisma ORM
* SQLite

AI Integration

* Google Gemini API

---

# Project Architecture

The application follows a simple full-stack architecture:

React Frontend
⬇
Express API Server
⬇
Prisma ORM
⬇
SQLite Database

The AI generation request flows through the backend server which communicates with the Gemini API.

---

# Project Structure

```
copycraft-ai/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductList.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── prisma/
│   │   └── schema.prisma
│   ├── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# Setup Instructions

## 1. Clone the repository

```
git clone https://github.com/yourusername/copycraft-ai.git
cd copycraft-ai
```

---

# Backend Setup

Navigate to the server folder:

```
cd server
```

Install dependencies:

```
npm install
```

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_api_key_here"
```

Run database migration:

```
npx prisma migrate dev --name init
```

Start the backend server:

```
npm run dev
```

The backend should now be running on:

```
http://localhost:5000
```

---

# Frontend Setup

Open a new terminal and navigate to the client folder:

```
cd client
```

Install dependencies:

```
npm install
```

Start the React development server:

```
npm run dev
```

The frontend should now be available at:

```
http://localhost:5173
```

---

# How to Use the App

1. Open the application in your browser.
2. Enter product details such as:

   * product name
   * category
   * features
   * tone
3. Click **Generate Description**.
4. The AI will generate a product description.
5. Click **Save Product** to store it in the database.
6. Use the product list to:

   * edit entries
   * delete entries
   * review generated descriptions.

---

# AI Generation

Product descriptions are generated using the **Google Gemini API**.

The backend sends product details to the Gemini model, which returns a concise marketing description tailored to the chosen tone.

Example prompt used:

```
Write a compelling ecommerce product description.

Product name: {name}
Category: {category}
Features: {features}
Tone: {tone}

Requirements:
- Keep it under 120 words
- Focus on benefits
- Return only the description
```

---

# CRUD Functionality

The application supports full database CRUD operations:

Create
Create a new product entry.

Read
Retrieve stored products from the database.

Update
Edit product details and descriptions.

Delete
Remove products from the database.

---

# Future Improvements

Possible improvements include:

* authentication and user accounts
* product search and filtering
* regenerate AI descriptions
* copy-to-clipboard functionality
* richer prompt customization
* deployment to cloud infrastructure

---

# License

This project is intended for educational and demonstration purposes.
