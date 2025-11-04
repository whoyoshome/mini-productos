/* prisma/seed.ts */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const data = [
    {
      name: "Keyboard",
      imageUrl: "https://loremflickr.com/1200/600/mechanical+keyboard?lock=11",
    },
    {
      name: "Mouse",
      imageUrl: "https://loremflickr.com/1200/600/computer+mouse?lock=22",
    },
    {
      name: "Monitor",
      imageUrl: "https://loremflickr.com/1200/600/monitor+screen?lock=33",
    },
    {
      name: "Headphones",
      imageUrl: "https://loremflickr.com/1200/600/headphones?lock=44",
    },
    {
      name: "Ergonomic Chair",
      imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200&h=600&fit=crop",
    },
    {
      name: "Smart Home Hub",
      imageUrl: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=1200&h=600&fit=crop",
    },
  ];

  await prisma.product.createMany({ data });
  console.log("Seed done ✅ (deterministic loremflickr, English names)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
