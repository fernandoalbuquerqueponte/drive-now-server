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
});
