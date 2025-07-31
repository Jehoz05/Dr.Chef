import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

// __dirname support for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve absolute path to meals.db
const dbPath = path.resolve(__dirname, "..", "data", "meals.db");

// Connect to database
const db = sql(dbPath);

// Get all meals
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
  return db.prepare("SELECT * FROM meals").all();
}

// Get a single meal
export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

// Save a meal with uploaded image
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const imagePath = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
  }

  const fileStream = fs.createWriteStream(path.join(imagePath, fileName));
  const buffer = await meal.image.arrayBuffer();

  fileStream.write(Buffer.from(buffer), (err) => {
    if (err) throw new Error("Saving image failed!");
  });

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
