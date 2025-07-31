import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getMeals() {
  const { data, error } = await supabase.from("meals").select("*");
  if (error) throw error;
  return data;
}

export async function getMeal(slug) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function saveMeal(meal) {
  const fileName = `${meal.slug}.${meal.image.name.split(".").pop()}`;
  const imageBuffer = Buffer.from(await meal.image.arrayBuffer());

  // Upload image to Supabase Storage (or use Cloudinary/S3)
  const { error: uploadError } = await supabase.storage
    .from("images") // make sure this bucket exists
    .upload(fileName, imageBuffer, {
      contentType: meal.image.type,
    });

  if (uploadError) throw uploadError;

  const publicURL = supabase.storage.from("images").getPublicUrl(fileName)
    .data.publicUrl;

  meal.image = publicURL;

  const { error: insertError } = await supabase.from("meals").insert([meal]);
  if (insertError) throw insertError;
}
