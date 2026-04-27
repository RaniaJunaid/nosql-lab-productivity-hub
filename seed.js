const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "productivityhub";

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection("users").deleteMany({});
    await db.collection("projects").deleteMany({});
    await db.collection("tasks").deleteMany({});
    await db.collection("notes").deleteMany({});

    const user1Id = new ObjectId();
    const user2Id = new ObjectId();

    await db.collection("users").insertMany([
      {
        _id: user1Id,
        name: "Rania Junaid",
        email: "rania@example.com",
        passwordHash: "hashed_password_1",
        createdAt: new Date(),
      },
      {
        _id: user2Id,
        name: "Ali Hassan",
        email: "ali@example.com",
        passwordHash: "hashed_password_2",
        createdAt: new Date(),
      },
    ]);

    const proj1Id = new ObjectId();
    const proj2Id = new ObjectId();
    const proj3Id = new ObjectId();
    const proj4Id = new ObjectId();

    await db.collection("projects").insertMany([
      {
        _id: proj1Id,
        userId: user1Id,
        name: "Database Lab",
        description: "Complete the NoSQL lab assignment",
        archived: false,
        createdAt: new Date(),
      },
      {
        _id: proj2Id,
        userId: user1Id,
        name: "Web App Project",
        description: "Build a full-stack web application",
        archived: false,
        createdAt: new Date(),
      },
      {
        _id: proj3Id,
        userId: user1Id,
        name: "Old Research",
        description: "Last semester research project",
        archived: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        _id: proj4Id,
        userId: user2Id,
        name: "Ali's Project",
        description: "Ali's personal project",
        archived: false,
        createdAt: new Date(),
      },
    ]);

    await db.collection("tasks").insertMany([
      {
        _id: new ObjectId(),
        projectId: proj1Id,
        title: "Design MongoDB Schema",
        status: "done",
        priority: 1,
        tags: ["design", "mongodb"],
        subtasks: [
          { title: "Choose embed vs reference", done: true },
          { title: "Write MODELING.md", done: true },
        ],
        createdAt: new Date(),
        dueDate: new Date("2025-05-01"),
      },
      {
        _id: new ObjectId(),
        projectId: proj1Id,
        title: "Write seed.js",
        status: "in-progress",
        priority: 1,
        tags: ["coding", "mongodb"],
        subtasks: [
          { title: "Insert users", done: true },
          { title: "Insert projects", done: true },
          { title: "Insert tasks", done: false },
        ],
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        projectId: proj1Id,
        title: "Implement 15 queries",
        status: "todo",
        priority: 1,
        tags: ["coding", "mongodb", "queries"],
        subtasks: [
          { title: "Implement CRUD queries", done: false },
          { title: "Implement aggregation queries", done: false },
        ],
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        projectId: proj2Id,
        title: "Set up Express server",
        status: "done",
        priority: 2,
        tags: ["backend", "setup"],
        subtasks: [
          { title: "Install dependencies", done: true },
          { title: "Create routes", done: true },
        ],
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        projectId: proj2Id,
        title: "Design frontend UI",
        status: "todo",
        priority: 3,
        tags: ["frontend", "design"],
        subtasks: [
          { title: "Create wireframes", done: false },
          { title: "Implement HTML/CSS", done: false },
        ],
        createdAt: new Date(),
      },
    ]);

    await db.collection("notes").insertMany([
      {
        _id: new ObjectId(),
        userId: user1Id,
        projectId: proj1Id,
        title: "MongoDB Cheatsheet",
        body: "Use $addToSet to avoid duplicates. Use positional $ for embedded array updates.",
        tags: ["mongodb", "reference"],
        createdAt: new Date(),
        pinned: true,
      },
      {
        _id: new ObjectId(),
        userId: user1Id,
        projectId: proj1Id,
        title: "Aggregation Pipeline Notes",
        body: "$match filters, $group aggregates, $lookup joins collections.",
        tags: ["mongodb", "aggregation"],
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        userId: user1Id,
        projectId: proj2Id,
        title: "Express Routing Notes",
        body: "Use router.get() for GET requests, router.post() for POST.",
        tags: ["backend", "express"],
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        userId: user1Id,
        projectId: null,
        title: "General Study Tips",
        body: "Break problems into small pieces. Test frequently.",
        tags: ["personal", "study"],
        createdAt: new Date(),
        pinned: true,
      },
      {
        _id: new ObjectId(),
        userId: user2Id,
        projectId: proj4Id,
        title: "Ali's Project Notes",
        body: "Remember to document all API endpoints.",
        tags: ["documentation", "backend"],
        createdAt: new Date(),
      },
    ]);

    console.log("Database seeded successfully!");
    console.log("Users: 2, Projects: 4, Tasks: 5, Notes: 5");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();