import { faker } from "@faker-js/faker";
import type { CreateCarSchema } from "../../schemas/car.js";
import { BookingStatus, type Booking, type Review } from "@prisma/client";

export const car: CreateCarSchema = {
  brand: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  category: "SUV",
  image: faker.image.url(),
  gallery: [faker.image.url(), faker.image.url()],
  year: 2022,
  pricePerHour: 120,
  description: faker.lorem.paragraph(),
  specifications: [
    { label: "Motor", value: "2.0 Flex" },
    { label: "Câmbio", value: "Automático CVT" },
  ],
  features: ["Air Conditioning", "ABS", "GPS"],
};

export const buildPrismaCarData = (data: typeof car) => ({
  ...data,
  specifications: {
    create: data.specifications,
  },
});

export const review: Review = {
  id: faker.string.uuid(),
  carId: faker.string.uuid(),
  userId: faker.string.uuid(),
  rating: faker.number.int({ min: 1, max: 5 }),
  comment: faker.lorem.sentence(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const booking: Booking = {
  id: faker.string.uuid(),
  carId: faker.string.uuid(),
  userId: faker.string.uuid(),
  startDate: faker.date.soon(),
  endDate: faker.date.future(),
  status: BookingStatus.PENDING,
  totalHours: 65,
  totalPrice: 600,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};
