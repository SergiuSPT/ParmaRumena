export type Match = {
  id: string;
  opponent: string;
  initials: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  round: number;
  home: boolean;
  // Final score in home/away order. Omit for fixtures still to be played.
  score?: { home: number; away: number };
};

// Sample fixtures only. Replace these with the confirmed club schedule.
export const demoMatches: Match[] = [
  { id: "demo-past-1", opponent: "FC Atlas", initials: "AT", date: "2026-08-23", time: "19:00", venue: "Arena Centrală", competition: "Cupa de vară", round: 1, home: true, score: { home: 4, away: 2 } },
  { id: "demo-past-2", opponent: "AS Progresul", initials: "PR", date: "2026-08-30", time: "20:00", venue: "Baza Sportivă Est", competition: "Cupa de vară", round: 2, home: false, score: { home: 3, away: 1 } },
  { id: "demo-past-3", opponent: "FC Vulturii", initials: "VU", date: "2026-09-06", time: "18:30", venue: "Arena Centrală", competition: "Cupa de vară", round: 3, home: true, score: { home: 2, away: 2 } },
  { id: "demo-1", opponent: "FC Unirea", initials: "UN", date: "2026-09-20", time: "19:00", venue: "Arena Centrală", competition: "Liga de minifotbal", round: 1, home: true },
  { id: "demo-2", opponent: "Sporting Club", initials: "SC", date: "2026-09-27", time: "20:30", venue: "Baza Sportivă Nord", competition: "Liga de minifotbal", round: 2, home: false },
  { id: "demo-3", opponent: "FC Victoria", initials: "VI", date: "2026-10-04", time: "18:00", venue: "Arena Centrală", competition: "Liga de minifotbal", round: 3, home: true },
  { id: "demo-4", opponent: "AS Olympik", initials: "OL", date: "2026-10-11", time: "19:30", venue: "Baza Sportivă Vest", competition: "Liga de minifotbal", round: 4, home: false },
  { id: "demo-5", opponent: "FC Dinamic", initials: "DI", date: "2026-10-18", time: "20:00", venue: "Arena Centrală", competition: "Liga de minifotbal", round: 5, home: true },
  { id: "demo-6", opponent: "Inter Arena", initials: "IA", date: "2026-10-25", time: "18:30", venue: "Complexul Sportiv Sud", competition: "Liga de minifotbal", round: 6, home: false },
];
