export type IntentCategory = "Emergency" | "Procedure" | "Platform Help" | "General Question";

export function classifyIntent(query: string): IntentCategory {
  const normalized = query.toLowerCase();
  
  const emergencyKeywords = [
    "fire", "burning", "smoke", 
    "heart attack", "chest pain", "stroke", "unconscious", "not breathing", "collapsed",
    "assault", "attacking", "kidnapped", "gun", "shooting", "stabbed", "murder",
    "gas leak", "explosion", "bomb",
    "flood", "earthquake", "trapped", "drowning",
    "help me", "dying", "emergency", "danger"
  ];
  
  const procedureKeywords = [
    "lost", "aadhaar", "pan card", "passport", "driving license", "dl",
    "fraud", "scam", "cyber", "stolen", "fir", "police station", 
    "compensation", "certificate", "apply", "register", "procedure", "how do i get"
  ];
  
  const platformKeywords = [
    "how to use", "dashboard", "sos button", "where is", "app", 
    "report an emergency", "contact authority", "trusted contacts", "alert"
  ];

  for (const keyword of emergencyKeywords) {
    if (normalized.includes(keyword)) return "Emergency";
  }

  for (const keyword of procedureKeywords) {
    if (normalized.includes(keyword)) return "Procedure";
  }

  for (const keyword of platformKeywords) {
    if (normalized.includes(keyword)) return "Platform Help";
  }

  return "General Question";
}
