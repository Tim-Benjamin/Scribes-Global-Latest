import { supabase } from "../client";
import type { Database } from "../database.types";

/* =========================================================
   TYPES
========================================================= */

export type VolunteerOpportunity =
  Database["public"]["Tables"]["volunteer_opportunities"]["Row"];

/* =========================================================
   GET ACTIVE OPPORTUNITIES
========================================================= */

export async function getVolunteerOpportunities() {
  return supabase
    .from("volunteer_opportunities")
    .select("*")
    .eq("status", "active")
    .order("priority", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });
}