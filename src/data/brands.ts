const aliases: Record<string, string[]> = {
  Adidas: ["AD", "ADIDAS", "ADISTAR", "SAMBA", "SUPER STAR", "SUPERSTAR"],
  "New Balance": ["NB", "NEW B", "NEW BALANCE"],
  Nike: ["NIKE", "AF1", "FREE METCON", "A BATHING APE"],
  Jordan: ["JORDAN", "RETRO 1"],
  On: ["ON", "ONRUNNING"],
  Converse: ["CONVERSE"],
  Vans: ["VANS"],
  Timberland: ["TIMBERLAND"],
  Valentino: ["VALENTINO"],
  "Alexander McQueen": ["ALEXANDER MC", "ALEXANDER MCQUEEN"],
  Bape: ["BAPE"],
  "Dolce & Gabbana": ["DOLCE & GABBANA", "DOLCE GABBANA"],
  "Hugo Boss": ["HUGO BOSS", "HUGO"],
  Puma: ["PUMA"],
  Reebok: ["REEBOK"],
};

export function brandFor(model: string): string {
  const name = model.trim().toUpperCase().replace(/\s+/g, " ");
  for (const [brand, prefixes] of Object.entries(aliases)) {
    if (prefixes.some(prefix => name === prefix || name.startsWith(`${prefix} `))) return brand;
  }
  return "Marca por confirmar";
}
