import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@drivenow.com" },
    update: {},
    create: {
      first_name: "Admin",
      last_name: "DriveNow",
      email: "admin@drivenow.com",
      password: "password123",
    },
  });

  const carsData = [
    {
      brand: "Audi",
      model: "A4 Avant",
      category: "Executivo",
      year: 2024,
      pricePerHour: 150,
      description: "Praticidade e elegância com conforto premium.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Bluetooth", "Teto solar", "Ar-condicionado digital"],
      specifications: [
        { label: "Motor", value: "2.0L TFSI" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Gasolina" },
      ],
    },
    {
      brand: "BMW",
      model: "X5",
      category: "SUV",
      year: 2023,
      pricePerHour: 200,
      description: "SUV luxuoso e potente, ideal para viagens longas.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [],
      features: ["Câmera 360º", "Bancos em couro", "Head-up display"],
      specifications: [
        { label: "Motor", value: "3.0L Turbo" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Diesel" },
      ],
    },
    {
      brand: "Tesla",
      model: "Model S",
      category: "Elétrico",
      year: 2024,
      pricePerHour: 280,
      description: "O futuro da condução com aceleração absurda.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Autopilot", "Zero Emissão", "Tela de 17 polegadas"],
      specifications: [
        { label: "Motor", value: "Elétrico Dual" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Elétrico" },
      ],
    },
    {
      brand: "Toyota",
      model: "Corolla",
      category: "Sedan",
      year: 2024,
      pricePerHour: 90,
      description: "Conforto e confiabilidade japonesa.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Câmera de ré", "Controle de cruzeiro", "7 Airbags"],
      specifications: [
        { label: "Motor", value: "2.0 Flex" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Flex" },
      ],
    },
    {
      brand: "Fiat",
      model: "Mobi",
      category: "Econômico",
      year: 2024,
      pricePerHour: 45,
      description: "Praticidade para o trânsito da cidade.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [],
      features: ["Econômico", "Fácil de estacionar", "Som Bluetooth"],
      specifications: [
        { label: "Motor", value: "1.0 Fire" },
        { label: "Transmissão", value: "Manual" },
        { label: "Combustível", value: "Flex" },
      ],
    },
    {
      brand: "Toyota",
      model: "Hilux",
      category: "Picape",
      year: 2023,
      pricePerHour: 220,
      description: "Força e resistência para qualquer terreno.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Tração 4x4", "Santo Antônio", "Capota Marítima"],
      specifications: [
        { label: "Motor", value: "2.8 Turbo Diesel" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Diesel" },
      ],
    },
    {
      brand: "Porsche",
      model: "911 Carrera",
      category: "Esportivo",
      year: 2023,
      pricePerHour: 450,
      description: "Performance pura para quem ama dirigir.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [],
      features: ["Escapamento Esportivo", "Modo Sport Plus", "PDK"],
      specifications: [
        { label: "Motor", value: "3.0L Boxer" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Gasolina" },
      ],
    },
    {
      brand: "Mercedes",
      model: "C300",
      category: "Sedan",
      year: 2024,
      pricePerHour: 180,
      description: "Sofisticação e tecnologia Mercedes-Benz.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Luzes ambiente", "Som Premium", "Frenagem autônoma"],
      specifications: [
        { label: "Motor", value: "2.0 Turbo" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Gasolina" },
      ],
    },
    {
      brand: "Ferrari",
      model: "F8 Tributo",
      category: "Esportivo",
      year: 2022,
      pricePerHour: 950,
      description: "A lenda das pistas agora nas suas mãos.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [],
      features: ["Acabamento em Carbono", "V8 Turbo"],
      specifications: [
        { label: "Motor", value: "3.9L V8" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Gasolina" },
      ],
    },
    {
      brand: "Jeep",
      model: "Compass",
      category: "SUV",
      year: 2024,
      pricePerHour: 110,
      description: "O SUV mais desejado do Brasil.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Park Assist", "Carregador Wireless"],
      specifications: [
        { label: "Motor", value: "1.3L Turbo" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Flex" },
      ],
    },
    {
      brand: "Volkswagen",
      model: "Gol",
      category: "Econômico",
      year: 2023,
      pricePerHour: 55,
      description: "O parceiro ideal para o trabalho.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2ygl8MwjiF2C1MY6AmLoEBtawKcrksGXnQT3x9",
      gallery: [],
      features: ["Baixo consumo", "Manutenção fácil"],
      specifications: [
        { label: "Motor", value: "1.0 MPI" },
        { label: "Transmissão", value: "Manual" },
        { label: "Combustível", value: "Flex" },
      ],
    },
    {
      brand: "Range Rover",
      model: "Evoque",
      category: "Luxo",
      year: 2024,
      pricePerHour: 350,
      description: "Design arrebatador e sofisticação.",
      image:
        "https://pofskjr7hn.ufs.sh/f/f0BnzNomkH2yAiZGmgEvi1R7JsH8PpYMxzdLDEQXWohuOlUa",
      gallery: [],
      features: ["Painel Digital", "Terrain Response"],
      specifications: [
        { label: "Motor", value: "2.0 Ingenium" },
        { label: "Transmissão", value: "Automático" },
        { label: "Combustível", value: "Híbrido" },
      ],
    },
  ];

  for (const car of carsData) {
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
        features: car.features,
        user_id: user.id,
        specifications: {
          create: car.specifications,
        },
      },
    });
  }

  console.log("✅ Seed finalizada!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
