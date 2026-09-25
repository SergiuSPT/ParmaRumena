export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  /** Public image path (e.g. /players/andrei.jpg); empty uses the shirt illustration. */
  photo: string;
  biography: string;
};

// Fictional roster for development. Replace this source with API data later.
export const mockPlayers: Player[] = [
  { id: "demo-1", firstName: "Darius", lastName: "Hoalba", number: 1, position: "Portar", photo: "/gallery-optimized/darius-preview.webp", biography: "Blocheaza suturile cu fata si are mai multe goluri ca multi din echipa:))" },
  { id: "demo-2", firstName: "Mihai", lastName: "Ionescu", number: 4, position: "Fundaș", photo: "", biography: "Siguranță în apărare și atenție la fiecare duel." },
  { id: "demo-3", firstName: "Alexandru", lastName: "Marin", number: 6, position: "Fundaș", photo: "", biography: "Joacă simplu, citește jocul și construiește din spate." },
  { id: "demo-4", firstName: "Cristian", lastName: "Dumitru", number: 8, position: "Mijlocaș", photo: "", biography: "Leagă apărarea de atac, cu energie și pase care deschid jocul." },
  { id: "demo-5", firstName: "Alexandru", lastName: "Miclaus", number: 10, position: "Atacant", photo: "/gallery-optimized/miclaus-preview.webp", biography: "Imaginație cu mingea la picior și curaj în momentele decisive." },
  { id: "demo-6", firstName: "Vlad", lastName: "Stan", number: 7, position: "Atacant", photo: "", biography: "Viteză, instinct și dorința de a transforma fiecare ocazie în gol." },
  { id: "demo-7", firstName: "Alexandru", lastName: "Petras", number: 9, position: "Atacant", photo: "/gallery-optimized/petras-preview.webp", biography: "Foloseste puterea prieteniei sa incurjeze coechipierii. Numar record de bari din vole." },
  { id: "demo-8", firstName: "Răzvan", lastName: "Matei", number: 11, position: "Atacant", photo: "", biography: "Aduce energie în atac și bucuria de a juca împreună." },
];
