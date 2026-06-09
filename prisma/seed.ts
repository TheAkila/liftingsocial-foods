import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const seedProducts = [
  {
    slug: "champion-chicken-rice",
    name: "Champion Chicken & Rice",
    tagline: "The classic. Engineered for gains.",
    description:
      "Grilled boneless chicken breast over fluffy basmati rice, finished with garlic-pepper sauce and house-roasted vegetables. The blueprint meal for serious lifters.",
    price: 1450,
    protein: 52,
    calories: 640,
    carbs: 68,
    fats: 14,
    category: "dinner",
    image: null,
    badge: "Bestseller",
    ingredients: "Chicken breast, Basmati rice, Bell peppers, Garlic, Olive oil",
    sortOrder: 10,
  },
  {
    slug: "beast-mode-beef-bowl",
    name: "Beast Mode Beef Bowl",
    tagline: "Heavy on protein. Heavier on flavor.",
    description:
      "Lean beef slow-cooked with onions and black pepper, served over brown rice with charred broccoli. A power bowl built for after the heaviest sets.",
    price: 1650,
    protein: 48,
    calories: 720,
    carbs: 64,
    fats: 22,
    category: "dinner",
    image: null,
    badge: "High Protein",
    ingredients: "Lean beef, Brown rice, Broccoli, Onion, Black pepper",
    sortOrder: 20,
  },
  {
    slug: "lean-mass-salmon",
    name: "Lean Mass Salmon",
    tagline: "Omega-fueled recovery.",
    description:
      "Oven-baked Norwegian salmon with quinoa pilaf and a side of steamed greens. Built for recovery days and clean eating.",
    price: 1950,
    protein: 44,
    calories: 590,
    carbs: 42,
    fats: 24,
    category: "dinner",
    image: null,
    badge: null,
    ingredients: "Salmon fillet, Quinoa, Spinach, Lemon, Herbs",
    sortOrder: 30,
  },
  {
    slug: "power-pasta",
    name: "Power Pasta",
    tagline: "Carbs that work for you.",
    description:
      "High-protein penne tossed with grilled chicken, sun-dried tomatoes, and a light pesto. Pre-workout fuel that tastes like a cheat meal.",
    price: 1550,
    protein: 42,
    calories: 680,
    carbs: 78,
    fats: 16,
    category: "lunch",
    image: null,
    badge: null,
    ingredients: "High-protein penne, Chicken, Sun-dried tomato, Pesto, Parmesan",
    sortOrder: 40,
  },
  {
    slug: "shred-stack-eggs",
    name: "Shred Stack",
    tagline: "Breakfast for builders.",
    description:
      "Six-egg-white scramble with turkey bacon, avocado, and sweet potato hash. The cleanest start to your day.",
    price: 1250,
    protein: 38,
    calories: 480,
    carbs: 34,
    fats: 18,
    category: "breakfast",
    image: null,
    badge: "Low Carb",
    ingredients: "Egg whites, Turkey bacon, Avocado, Sweet potato",
    sortOrder: 50,
  },
  {
    slug: "iron-curry-chicken",
    name: "Iron Curry Chicken",
    tagline: "Sri Lankan heat. Lifter macros.",
    description:
      "House-spiced chicken curry over red rice with mallum and dhal. Local flavors built around a lean protein profile.",
    price: 1350,
    protein: 46,
    calories: 660,
    carbs: 72,
    fats: 15,
    category: "dinner",
    image: null,
    badge: "Local Favorite",
    ingredients: "Chicken, Red rice, Coconut, Curry leaves, Dhal",
    sortOrder: 60,
  },
  {
    slug: "pump-protein-pancakes",
    name: "Pump Protein Pancakes",
    tagline: "Stack 'em. Lift 'em.",
    description:
      "Oat and whey pancakes with banana, almond butter, and a drizzle of honey. 35g of protein in a meal that feels like dessert.",
    price: 1150,
    protein: 35,
    calories: 540,
    carbs: 62,
    fats: 14,
    category: "breakfast",
    image: null,
    badge: null,
    ingredients: "Oats, Whey, Banana, Almond butter, Honey",
    sortOrder: 70,
  },
  {
    slug: "recovery-tuna-wrap",
    name: "Recovery Tuna Wrap",
    tagline: "Grab. Crush. Repeat.",
    description:
      "High-protein tortilla loaded with seared tuna, mixed greens, and a sriracha-yogurt sauce. Built for between-set fuel.",
    price: 950,
    protein: 32,
    calories: 420,
    carbs: 36,
    fats: 12,
    category: "snack",
    image: null,
    badge: null,
    ingredients: "Tuna, Protein wrap, Mixed greens, Greek yogurt, Sriracha",
    sortOrder: 80,
  },
];

async function main() {
  // Seed admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@theliftingsocial.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Founder";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "admin",
    },
  });

  console.log(`✓ Admin user ready: ${adminEmail} / ${adminPassword}`);

  // Seed products (only if none exist)
  const count = await db.product.count();
  if (count === 0) {
    for (const p of seedProducts) {
      await db.product.create({ data: p });
    }
    console.log(`✓ Seeded ${seedProducts.length} products`);
  } else {
    console.log(`• Skipping product seed (${count} already exist)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
