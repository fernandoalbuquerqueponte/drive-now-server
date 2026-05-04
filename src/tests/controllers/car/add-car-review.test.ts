/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddCarReviewController } from "../../../controllers/car/add-car-review.js";

class AddCarReviewUseCaseStub {
  async execute() {
    return {
      id: "review-id",
      carId: "car-id",
      userId: "user-id",
      rating: 5,
      comment: "Excelente",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: "user-id",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashed",
        imageUrl: "http://example.com/image.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    };
  }
}

describe("AddCarReviewController", () => {
  it("should return 201 when review is created successfully", async () => {
    const addCarReviewUseCaseStub = new AddCarReviewUseCaseStub();
    const sut = new AddCarReviewController(addCarReviewUseCaseStub as any);

    const httpRequest = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      carId: "550e8400-e29b-41d4-a716-446655440000",
      body: {
        rating: 5,
        comment: "Excelente",
      },
    };

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id", "review-id");
  });

  it("should call AddCarReviewUseCase with correct params", async () => {
    const addCarReviewUseCaseStub = new AddCarReviewUseCaseStub();
    const executeSpy = jest.spyOn(addCarReviewUseCaseStub, "execute");
    const sut = new AddCarReviewController(addCarReviewUseCaseStub as any);

    const httpRequest = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      carId: "550e8400-e29b-41d4-a716-446655440000",
      body: {
        rating: 4,
        comment: "Muito bom",
      },
    };

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({
        rating: 4,
        comment: "Muito bom",
      }),
    );
  });

  it("should return 400 when request body is invalid", async () => {
    const addCarReviewUseCaseStub = new AddCarReviewUseCaseStub();
    const sut = new AddCarReviewController(addCarReviewUseCaseStub as any);

    const httpRequest = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      carId: "550e8400-e29b-41d4-a716-446655440000",
      body: {
        rating: 10,
      },
    };

    const response = await sut.execute(httpRequest as any);

    expect(response.statusCode).toBe(400);
  });
});
