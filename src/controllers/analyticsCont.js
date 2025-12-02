import { getAllDateAnalyticsSvc } from "../services/analyticsSvc.js";

export async function getAllDateAnalyticsCont({ req, res }) {
  try {
    const data = await getAllDateAnalyticsSvc();
    return res.status(200).json(data);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}