const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Lesson = require("../models/lesson");
const { app } = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /api/lesson/", () => {
  beforeAll(async () => {
    await Lesson.create([
      { lessonId: "html-basics", title: "HTML Basics", content: "Content", order: 1 },
      { lessonId: "css-fundamentals", title: "CSS Fundamentals", content: "Content", order: 2 },
    ]);
  });

  it("returns all lessons", async () => {
    const res = await supertest(app).get("/api/lesson/");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});

describe("GET /api/lesson/:id", () => {
  it("returns a lesson for a valid lessonId", async () => {
    const res = await supertest(app).get("/api/lesson/html-basics");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("lessonId", "html-basics");
    expect(res.body).toHaveProperty("title", "HTML Basics");
  });

  it("returns 404 for an invalid lessonId", async () => {
    const res = await supertest(app).get("/api/lesson/nonexistent");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});
