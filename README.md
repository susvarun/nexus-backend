# Nexus Blog Platform - Backend

This is the backend API for the Nexus Blog Platform, built with Node.js, Express.js, and MongoDB.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Uploads**: Multer, Freeimage API (via node-fetch)

## 🛠️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root of the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   FREEIMAGE_API_KEY=your_freeimage_api_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Starts the server in development mode using nodemon.
- `npm start`: Starts the server in production mode.
