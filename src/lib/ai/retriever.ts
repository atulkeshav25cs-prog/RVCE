import Procedure from "@/models/Procedure";
import Alert from "@/models/Alert";

export async function retrieveRelevantProcedures(query: string, maxResults: number = 1) {
  const normalized = query.toLowerCase();
  
  // Basic token search - in production a vector DB is preferred
  const keywords = normalized.split(/\W+/).filter(k => k.length > 3);
  
  if (keywords.length === 0) return [];

  // Match title or summary with keywords using simple regex
  const regex = new RegExp(keywords.join('|'), 'i');
  
  const procedures = await Procedure.find({
    $or: [
      { title: { $regex: regex } },
      { category: { $regex: regex } },
      { summary: { $regex: regex } }
    ]
  }).limit(maxResults).lean();

  return procedures.map((p: any) => ({
    id: p.procedureId,
    title: p.title,
    summary: p.summary,
    steps: p.steps,
    url: p.officialWebsite
  }));
}

export async function retrieveActiveAlerts(location?: string) {
  const query: any = {
    status: "Active",
    expiresAt: { $gt: new Date() }
  };
  
  // Note: if user location is known, we could filter by targetArea here using regex
  // For now, we return global active alerts to keep them aware.
  
  const alerts = await Alert.find(query).limit(3).lean();
  
  return alerts.map((a: any) => ({
    title: a.title,
    severity: a.severity,
    description: a.description,
    area: a.targetArea
  }));
}
