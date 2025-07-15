import { addDays, addWeeks, addMonths } from "date-fns";
import { RelationshipStatus } from "@/types/contact";

// Follow-up intervals based on relationship status
export const getFollowUpInterval = (relationship: RelationshipStatus): number => {
  switch (relationship) {
    case RelationshipStatus.MENTOR:
      return 21; // 3 weeks
    case RelationshipStatus.MENTEE:
      return 14; // 2 weeks
    case RelationshipStatus.CLOSE:
      return 30; // 1 month
    case RelationshipStatus.FRIENDLY:
      return 45; // 6 weeks
    case RelationshipStatus.PROFESSIONAL:
      return 60; // 2 months
    case RelationshipStatus.ACQUAINTANCE:
      return 90; // 3 months
    case RelationshipStatus.STRANGER:
      return 180; // 6 months
    default:
      return 60; // Default to 2 months
  }
};

export const calculateFollowUpDate = (relationship: RelationshipStatus, fromDate: Date = new Date()): Date => {
  const days = getFollowUpInterval(relationship);
  return addDays(fromDate, days);
};

export const getFollowUpDescription = (relationship: RelationshipStatus): string => {
  const days = getFollowUpInterval(relationship);
  if (days === 14) return "2 weeks";
  if (days === 21) return "3 weeks";
  if (days === 30) return "1 month";
  if (days === 45) return "6 weeks";
  if (days === 60) return "2 months";
  if (days === 90) return "3 months";
  if (days === 180) return "6 months";
  return `${days} days`;
};