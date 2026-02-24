# 🌐 Social Network API

## 📄 Description

The Social Network API is a RESTful backend application built with Node.js, Express, MongoDB, and Mongoose. It provides the core functionality required for a social networking platform, including user management, thought creation, reactions, and friend relationships.

This project highlights best practices for building a NoSQL API using Mongoose schemas, virtual properties, and a modular MVC-style architecture.
---

## 🛠️ Technologies Used

- 🟢 Node.js
- ⚡ Express.js
- 🍃 MongoDB
- 📦 Mongoose
- 💻 JavaScript (ES6+)
- ✨ Features
- 🔁 Full CRUD operations for users and thoughts
- 👥 Add and remove friends
- 💬 Add and remove reactions on thoughts
- 📊 Virtual properties for friend and reaction counts
- 🧩 Organized routes, controllers, and models
---

## 🔗 API Routes

**👤 Users & Friends**

- GET /api/users
- GET /api/users/:userId
- POST /api/users
- PUT /api/users/:userId
- DELETE /api/users/:userId
- POST /api/users/:userId/friends/:friendId
- DELETE /api/users/:userId/friends/:friendId

**💡 Thoughts & Reactions**

- GET /api/thoughts
- GET /api/thoughts/:thoughtId
- POST /api/thoughts
- PUT /api/thoughts/:thoughtId
- DELETE /api/thoughts/:thoughtId
- POST /api/thoughts/:thoughtId/reactions
- DELETE /api/thoughts/:thoughtId/reactions/:reactionId
---

## 📥 Installation
```bash
npm install
```
---

## ▶️ Run the Server
```bash
npm start
```

The API will be available at:
`http://localhost:3001`


Use Insomnia or Postman to test the endpoints.
---

## 🌱 Database Seeding

Populate the database with sample data:
```bash
npm run seed
```
---

## 🗂️ Data Models

- User — username, email, thoughts, friends
- Virtual: friendCount
- Thought — thought text, username, reactions
-Virtual: reactionCount
- Reaction — subdocument with reaction body, username, and timestamp

## 📜 License

This project is licensed under the MIT License.