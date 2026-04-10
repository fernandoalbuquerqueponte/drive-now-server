import { faker } from "@faker-js/faker";
import type { CreateCarSchema } from "../../schemas/car.js";

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
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};
