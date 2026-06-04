import { AestheticMetrics, HealthMetrics } from "../types";

export function getRankTitle(score: number): string {
  if (score <= 200) return "Bronze"; // Beginner
  if (score <= 400) return "Silver"; // Advanced
  if (score <= 600) return "Gold"; // Expert
  if (score <= 800) return "Diamond"; // Master
  if (score <= 950) return "Amethyst"; // Elite
  return "Platinum"; // Legend
}

export function calculateFootScore(
  aesthetic: AestheticMetrics,
  health: HealthMetrics
): number {
  // Aesthetic Score Calculation (Max 1000)
  // Weighted: Shape (25%), Toe Type (20% - mapped from string/quality), Proportions (15%), Arch (10%), Symmetry (10%), Line Clarity (10%), AI Beauty Index (10%)
  
  // Note: Assuming 'toeType' gives a flat score for now, but in reality it would be a map.
  // We'll treat the aesthetic metrics as 0-100 internally and scale them.
  const toeTypeScoreMap: Record<string, number> = {
    'Egyptian': 100,
    'Roman': 85,
    'Greek': 90,
    'Celtic': 80,
    'Germanic': 75,
  };
  const safeToeScore = toeTypeScoreMap[aesthetic.toeType] || 80;

  const aestheticScore = 
    (aesthetic.shape * 2.5) +          // 25%
    (safeToeScore * 2.0) +             // 20%
    (aesthetic.proportions * 1.5) +    // 15%
    (aesthetic.arch * 1.0) +           // 10%
    (aesthetic.symmetry * 1.0) +       // 10%
    (aesthetic.lineClarity * 1.0) +    // 10%
    (aesthetic.beautyIndex * 1.0);     // 10%
    // Total Aesthetic = 1000 MAX

  // Health Score Calculation (Max 1000)
  // Weighted (total 30% of final, which we'll scale here out of 1000, then mix)
  // Note requirement was: Pronation (8% -> scaled), Plantar Arch (8%), Deformities (7%), Size Precision (7%)
  // They add up to 30%. That means if we calculate out of 1000 for health:
  // Pronation: 8/30 = ~26.66%
  // Arch: 8/30 = ~26.66%
  // Deformity: 7/30 = ~23.33%
  // Size: 7/30 = ~23.33%
  const healthScore = 
    (health.pronation * (80/30) * 10) + 
    (health.plantarArch * (80/30) * 10) + 
    (health.halluxValgus * (70/30) * 10) + 
    (health.sizeMm > 200 && health.sizeMm < 300 ? 233.3 : 150); // Dummy sizing health scalar
    
  const normalizedHealth = Math.min(1000, Math.max(0, healthScore));
  const normalizedAesthetic = Math.min(1000, Math.max(0, aestheticScore));

  // Final Composite = (Aesthetic * 0.70) + (Health * 0.30)
  const finalScore = (normalizedAesthetic * 0.70) + (normalizedHealth * 0.30);
  
  return Math.round(finalScore);
}
