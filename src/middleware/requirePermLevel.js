export function requirePermLevel(levelRequired) {
  return (req, res, next) => {
    if (!req.user || typeof req.user.permLevel !== "number") {
      return res.status(401).json({ error: "Not authenticated." });
    }

    if (req.user.permLevel > levelRequired) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions." });
    }

    next();
  };
}