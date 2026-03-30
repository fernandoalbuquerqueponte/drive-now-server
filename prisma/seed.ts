import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  /**
   * 1️⃣ Criar usuário base (owner dos carros)
   */
  const user = await prisma.user.upsert({
    where: {
      email: "admin@drivenow.com",
    },
    update: {},
    create: {
      first_name: "Admin",
      last_name: "DriveNow",
      email: "admin@drivenow.com",
      password: "hashed-password-aqui",
      imageUrl: null,
    },
  });

  /**
   * 2️⃣ Lista de carros
   */
  const cars = [
    {
      brand: "Audi",
      model: "A4 Avant",
      category: "Executivo",
      year: 2024,
      pricePerHour: 150,
      description:
        "O Audi A4 Avant combina praticidade e elegância, oferecendo conforto premium e excelente dirigibilidade.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yP38QIsHOhoIcHGtpA4e53QJxVYrfSRzi0WsM",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yaVpakVerIapuAq4NW0n7JZwBMEShe2jlT56G",
      ],
      specifications: [
        { label: "Motor", value: "2.0L TFSI" },
        { label: "Potência", value: "190 cv" },
      ],
      features: ["Bluetooth", "Teto solar", "Ar-condicionado digital"],
    },
    {
      brand: "BMW",
      model: "X5",
      category: "SUV",
      year: 2023,
      pricePerHour: 200,
      description: "SUV luxuoso e potente, ideal para viagens e uso urbano.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2y49XEG5f1Z0GilcTBOXtnhb6RFrsVgLo5KdIe",
      ],
      specifications: [
        { label: "Motor", value: "3.0L TwinPower Turbo" },
        { label: "Potência", value: "286 cv" },
      ],
      features: ["Câmera 360º", "Bancos em couro", "Head-up display"],
    },
  ];

  /**
   * 3️⃣ Criar carros
   */
  for (const car of cars) {
    await prisma.car.create({
      data: {
        brand: car.brand,
        model: car.model,
        category: car.category,
        image: car.image,
        gallery: car.gallery,
        year: car.year,
        pricePerHour: car.pricePerHour,
        description: car.description,
        available: true,
        specifications: car.specifications,
        features: car.features,

        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  console.log("✅ Seed executada com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
