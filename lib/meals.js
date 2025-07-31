import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

//  Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Resolve absolute path to the SQLite database
const dbPath = path.resolve(__dirname, "..", "data", "meals.db");
const db = sql(dbPath);

//  Get all meals
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
  return db.prepare("SELECT * FROM meals").all();
}

//  Get a single meal by slug
export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

//  Save a meal
export async function saveMeal(meal) {
  // Sanitize and generate slug
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // Extract file extension
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  // Ensure directory exists
  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Save image to public/images
  const filePath = path.join(imagesDir, fileName);
  const stream = fs.createWriteStream(filePath);
  const bufferedImage = await meal.image.arrayBuffer();

  // Write image data to file
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  // Set image path for DB
  meal.image = `/images/${fileName}`;

  // Insert into database
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
