/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("@scalar/express-api-reference", () => ({
  apiReference: jest.fn(() => (req: any, res: any, next: any) => next()),
}));
import request from "supertest";
import { app } from "../../app.js";
import { user } from "../fixtures/user.js";

describe("Users Route E2E Tests", () => {
  const { id, ...userData } = user;

  it("POST /api/users should return 201 when user is created successfully", async () => {
    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
  });

  it("POST /api/users should return 400 when email is already in use", async () => {
    await request(app).post("/api/users").send(userData);

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("GET /api/users should return 401 when token is missing", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
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

  it("DELETE /api/usersshould return 401 when token is missing", async () => {
    const response = await request(app).delete("/api/users");

    expect(response.status).toBe(401);
  });

  it("PATCH /api/users should return 200 when user is updated successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(userData);

    const updatedUserData = {
      first_name: "Updated Name",
      password: "newpassword123",
      last_name: "Updated Last Name",
    };

    const response = await request(app)
      .patch("/api/users")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send(updatedUserData);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe("Updated Name");
    expect(response.body.last_name).toBe("Updated Last Name");
  });

  it("PATCH /api/users should return 401 when token is missing", async () => {
    const response = await request(app).patch("/api/users").send({
      first_name: "Updated Name",
      password: "newpassword123",
      last_name: "Updated Last Name",
    });

    expect(response.status).toBe(401);
  });

  it("POST /api/users/login should return 200 when user logs in successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(userData);

    const response = await request(app).post("/api/users/login").send({
      email: createdUser.email,
      password: userData.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();
  });

  it("POST /api/users/refresh-token should return 200 when token is refreshed", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(userData);

    const response = await request(app)
      .post("/api/users/refresh-token")
      .send({ refreshToken: createdUser.tokens.refreshToken });

    expect(response.status).toBe(200);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it("POST /api/users/login should return 401 when credentials are invalid", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "invalid34@mail.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });
});
