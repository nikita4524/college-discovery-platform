import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getCollegeImageUrl(name: string): string {
  const seed = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://picsum.photos/seed/${seed}/800/450`;
}

async function main() {
  const colleges = await prisma.college.findMany();
  for (const college of colleges) {
    await prisma.college.update({
      where: { id: college.id },
      data: { imageUrl: getCollegeImageUrl(college.name) },
    });
  }
  console.log(`Updated ${colleges.length} college images.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
