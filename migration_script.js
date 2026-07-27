import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Replace these with your Supabase URL and Key
const SUPABASE_URL = "https://iusgkmwjvjxbxrmlqyew.supabase.co";
const SUPABASE_KEY = "sb_publishable_EQxF54QTyRcceISiiBK_WA_bbm7e4lt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const migrateData = async () => {
  try {
    // 1. Migrate Agents
    const agentsData = JSON.parse(
      readFileSync("./src/data/agents.json", "utf8"),
    );
    console.log("Migrating agents...");
    const { error: agentsError } = await supabase
      .from("agents")
      .upsert(agentsData);
    if (agentsError) throw agentsError;

    // 2. Migrate Properties
    const propertiesData = JSON.parse(
      readFileSync("./src/data/properties.json", "utf8"),
    );
    const mappedProperties = propertiesData.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      status: p.status,
      price: p.price,
      location: p.location,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      size: p.size,
      images: p.images,
      description: p.description,
      amenities: p.amenities,
      agent_id: p.agent,
      featured: p.featured,
      date_added: p.dateAdded,
    }));

    console.log("Migrating properties...");
    const { error: propertiesError } = await supabase
      .from("properties")
      .upsert(mappedProperties);
    if (propertiesError) throw propertiesError;

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  }
};

migrateData();
