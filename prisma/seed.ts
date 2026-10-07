import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({
    data: [
      { name: "Cappuccino", description: "Espresso with steamed milk and a thick foam.", price: 350, category: "Coffee" },
      { name: "Iced Latte", description: "Chilled espresso over milk and ice.", price: 400, category: "Coffee" },
      { name: "Kenyan Filter Coffee", description: "Smooth single-origin brew.", price: 300, category: "Coffee" },
      { name: "Avocado Toast", description: "Sourdough, smashed avocado, lime and chilli.", price: 650, category: "Food" },
      { name: "Chicken Wrap", description: "Grilled chicken, greens and garlic sauce.", price: 700, category: "Food" },
      { name: "Veggie Bowl", description: "Seasonal vegetables, grains and tahini.", price: 750, category: "Food", available: false },
      { name: "Chocolate Cake", description: "Rich, moist and served warm.", price: 450, category: "Desserts" },
      { name: "Fruit Salad", description: "Fresh local fruit with honey.", price: 350, category: "Desserts" },
    ],
  });

  console.log("Menu seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());