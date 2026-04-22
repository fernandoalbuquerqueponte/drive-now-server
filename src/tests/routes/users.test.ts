import request from "supertest";
import { app } from "../../app.js";
import { user } from "../fixtures/user.js";

describe("Users Route E2E Tests", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...userData } = user;

  it("POST /api/users should return 201 when user is created successfully", async () => {
    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
  });
});
