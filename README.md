# CopyCraft AI

## What the App Does

CopyCraft AI is a full-stack web application that helps users generate and manage ecommerce product descriptions using AI.

Users can:

* Register and log in
* Create products with details such as name, category, features, and tone
* Generate AI-written product descriptions
* Save descriptions to a database
* Edit or delete their products later

Each user only sees and manages their own products.

---

## LLMs and Tools Used

**AI / LLM**

* Google Gemini API (Gemini Flash model)

**Frontend**

* React
* Vite
* Tailwind CSS
* React Hot Toast

**Backend**

* Node.js
* Express

**Database**

* Prisma ORM
* SQLite

**Auth**

* JWT (jsonwebtoken)
* bcryptjs for password hashing

---

Initially, the application was implemented using the **OpenAI API** for generating product descriptions.
However, the integration failed during testing because the account had **no available API quota**, causing the backend to return an `insufficient_quota` error whenever the description generation endpoint was called.

The solution was to switch the AI provider to **Google Gemini**.

Using AI assistance during development, I prompted for:

* a migration strategy from OpenAI to Gemini
* a minimal code change approach
* updated API calls compatible with the Gemini SDK

The result was replacing the OpenAI client with the **@google/genai SDK** and updating the generation route to use:

```
ai.models.generateContent()
```

This allowed the application to keep the same architecture while restoring AI functionality using Gemini’s free developer tier.

---

## Running the Project

Backend:

```
cd server
npm install
npx prisma migrate dev
npm run dev
```

Frontend:

```
cd client
npm install
npm run dev
```

Open the app at:

```
http://localhost:5173
```
