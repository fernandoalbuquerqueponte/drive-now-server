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

  it("GET /api/users should return 200 when user by id is found", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(userData);

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });

  it("DELETE /api/users should return 200 when user is deleted successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(userData);

    const response = await request(app)
      .delete("/api/users")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
  });
});
