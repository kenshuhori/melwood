import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  const { data: users, error } = await supabase.from("users").select("*");
  console.log(users);
}

main().catch(console.error);
