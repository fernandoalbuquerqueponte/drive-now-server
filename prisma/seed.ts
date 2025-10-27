import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Lista de carros para popular o banco
  const cars = [
    {
      brand: "Audi",
      model: "A4 Avant",
      category: "Executivo",
      year: 2024,
      pricePerHour: 150,
      description:
        "O Audi A4 Avant combina praticidade e elegância, oferecendo conforto premium e excelente dirigibilidade para o dia a dia.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      specifications: [
        { label: "Motor", value: "2.0L TFSI" },
        { label: "Potência", value: "190 cv" },
        { label: "Aceleração", value: "0–100 km/h em 7.3s" },
        { label: "Velocidade Máx.", value: "230 km/h" },
      ],
      features: [
        "Bluetooth",
        "Ar-condicionado digital",
        "Controle de tração",
        "Teto solar",
      ],
      images: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yP38QIsHOhoIcHGtpA4e53QJxVYrfSRzi0WsM",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yaVpakVerIapuAq4NW0n7JZwBMEShe2jlT56G",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yWovIhzH3mUsQG7Zl5S10XDbafxkdIBE2Ki6J",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      ],
    },
    {
      brand: "BMW",
      model: "X5",
      category: "SUV",
      year: 2023,
      pricePerHour: 200,
      description:
        "SUV luxuoso e potente, o BMW X5 entrega desempenho esportivo e conforto premium, ideal para viagens e uso urbano.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      specifications: [
        { label: "Motor", value: "3.0L TwinPower Turbo" },
        { label: "Potência", value: "286 cv" },
        { label: "Aceleração", value: "0–100 km/h em 6.1s" },
        { label: "Tração", value: "Integral xDrive" },
      ],
      features: [
        "Bancos em couro",
        "Câmera 360º",
        "Assistente de faixa",
        "Head-up display",
      ],
      images: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2y49XEG5f1Z0GilcTBOXtnhb6RFrsVgLo5KdIe",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yXl4Qhfua0rmqhw89jecZ6z4TAPEQxK27it3v",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yHeBqZUCvMORYPkLAzWutaGyHpiDSr76Um1hb",
      ],
    },
    {
      brand: "Mercedes",
      model: "C Class",
      category: "Sedan",
      year: 2023,
      pricePerHour: 180,
      description:
        "O Mercedes C-Class oferece uma experiência refinada, aliando design moderno e tecnologia de ponta.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yEvXKEVPjbq7s9DhiXnW4vIBKa5goNVTztdlZ",
      specifications: [
        { label: "Motor", value: "2.0L Turbo" },
        { label: "Potência", value: "204 cv" },
        { label: "Câmbio", value: "Automático 9G-Tronic" },
      ],
      features: [
        "GPS integrado",
        "Piloto automático",
        "Sensor de estacionamento",
        "Teto panorâmico",
      ],
      images: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yf6AhjFomkH2yVwpdgM9PjYIZqFh7i6bnu0WN",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yZvih2oRSjDU5fVCcHvI7BnRbYF4JulmqLNg8",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yNn1z3VDGriAawSYmMxQXEu0dWHqt1yj5hZCs",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yToe4HWLcmPwSxV4lr9IG1BAMTRFadn6ZNesH",
      ],
    },
    {
      brand: "Porsche",
      model: "911 Carrera",
      category: "Esportivo",
      year: 2022,
      pricePerHour: 300,
      description:
        "O lendário Porsche 911 Carrera é sinônimo de performance e emoção ao dirigir. Um ícone entre os esportivos.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yE0NtG1Pjbq7s9DhiXnW4vIBKa5goNVTztdlZ",
      specifications: [
        { label: "Motor", value: "3.0L Twin Turbo" },
        { label: "Potência", value: "385 cv" },
        { label: "Aceleração", value: "0–100 km/h em 4.2s" },
        { label: "Tração", value: "Traseira" },
      ],
      features: ["Sistema de som Bose", "Modo Sport Plus", "Bancos aquecidos"],
      images: [
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yHSY1KnCvMORYPkLAzWutaGyHpiDSr76Um1hb",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yWWySjOH3mUsQG7Zl5S10XDbafxkdIBE2Ki6J",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yftxspKsomkH2yVwpdgM9PjYIZqFh7i6bnu0W",
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yQvmIxVnR7T4lHpnUPjNSsZcy3tXou1v0Orz6",
      ],
    },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: {
        brand: car.brand,
        model: car.model,
        category: car.category,
        image: car.image,
        year: car.year,
        pricePerHour: car.pricePerHour,
        description: car.description,
        available: true,
        specifications: car.specifications,
        features: car.features,
        images: {
          create: car.images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log("✅ Seed executada com sucesso!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
