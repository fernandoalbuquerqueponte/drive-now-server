import request from "supertest";

import { app } from "../../app.js";
import { user } from "../fixtures/user.js";
import { car } from "../fixtures/index.js";

describe("Cars Route E2E Tests", () => {
  it("POST /api/cars should return 201 when car is created successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send(car);

    expect(response.status).toBe(201);
  });

  it("GET /api/cars/:carId should fetch car reviews", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdCar } = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send(car);

    const response = await request(app)
      .get(`/api/cars/${createdCar.id}`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
  });

  it("DELETE /api/cars/carId should delete a car successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdCar } = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send(car);

    const response = await request(app)
      .delete(`/api/cars/${createdCar.id}`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
  });
});
