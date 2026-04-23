import request from "supertest";

import { app } from "../../app.js";
import { user } from "../fixtures/user.js";
import { car } from "../fixtures/index.js";
import { faker } from "@faker-js/faker";

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

  it("POST /api/cars should return 401 when token is missing", async () => {
    const response = await request(app).post("/api/cars").send(car);

    expect(response.status).toBe(401);
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

  it("GET /api/cars/:carId should return 404 when car is not found", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .get(`/api/cars/${faker.string.uuid()}`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(404);
  });

  it("GET /api/cars/:carId should return 401 when token is missing", async () => {
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

    const response = await request(app).get(`/api/cars/${createdCar.id}`);

    expect(response.status).toBe(401);
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

  it("PATCH /api/cars/:carId should update a car successfully", async () => {
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
      .patch(`/api/cars/${createdCar.id}`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send({ brand: "Updated Brand", year: 2020 });

    expect(response.status).toBe(200);
  });

  it("POST /api/cars/reserve/:carId should booking a car successfully", async () => {
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
      .post(`/api/cars/reserve/${createdCar.id}`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        startDate: faker.date.soon(),
        endDate: faker.date.future(),
      });

    expect(response.status).toBe(201);
  });
});
