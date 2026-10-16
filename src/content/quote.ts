// Options for the "Get a quote" brief builder. Edit freely: the form, the
// validation, the emails and Supabase all read from here.

/** Budget ranges shown in step 3. TODO: adjust to your real pricing. */
export const BUDGETS = [
  "Under ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1 – 3 lakh",
  "₹3 lakh +",
  "Not sure yet",
] as const;

/** Suggestions for the city field (visitors can type any city). */
export const CITY_SUGGESTIONS = ["Delhi", "Gurugram", "Noida", "Faridabad", "Mumbai", "Bengaluru", "Jaipur", "Chandigarh"];

/** Short helper text under each service card in step 1. */
export const SERVICE_HINTS: Record<string, string> = {
  Photography: "Fashion, product, e-commerce, portraits",
  "Video Production": "Brand films, ads, reels, music videos",
  "Podcast Production": "Recording, editing, studio, clips",
  "Event Coverage": "Shows, launches, corporate, live",
  "Creative Direction": "Concept, art direction, styling",
  "Content Creation": "Social content, reels, UGC",
};

export const MAX_REFERENCE_LINKS = 5;
