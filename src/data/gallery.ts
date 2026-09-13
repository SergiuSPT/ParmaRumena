export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  layout: "wide" | "portrait";
};

// Remaining match photographs from public/, separate from the original album.
const additionalPhotoNumbers = [
  "0497", "0540", "0673", "0684", "0698", "0737", "0758", "0762",
  "0775", "0788", "0794", "0807", "0822", "0843", "0858", "0874",
  "0896", "0899", "0921",
];
const landscapePhotos = new Set(["0673", "0684", "0698", "0775", "0921"]);

export const additionalGalleryPhotos: GalleryPhoto[] = additionalPhotoNumbers.map((number, index) => ({
  id: `match-${number}`,
  src: `/DSC_${number}.jpg`,
  alt: `Fotografie din albumul de meci Parma Rumena, cadrul ${index + 1}`,
  title: `Momente de la meci · ${index + 1}`,
  category: "MECIURI",
  layout: landscapePhotos.has(number) ? "wide" : "portrait",
}));

// Add match photos here, placing the corresponding image files in public/.
export const galleryPhotos: GalleryPhoto[] = [
  { id: "team-night", src: "/parma-demo4.jpeg", alt: "Echipa Parma Rumena în fața porții, pe terenul iluminat seara", title: "Împreună, pe teren.", category: "ECHIPA", layout: "wide" },
  { id: "team-warm-up1", src: "/DSC_0506.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "wide" },
  { id: "team-warm-up2", src: "/DSC_0524.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up3", src: "/DSC_0528.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up4", src: "/DSC_0532.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up5", src: "/DSC_0539.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up6", src: "/DSC_0543.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up11", src: "/DSC_0558.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "wide" },
  { id: "team-warm-up7", src: "/DSC_0660.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "wide" },
  { id: "team-warm-up8", src: "/DSC_0666.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up9", src: "/DSC_0727.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "team-warm-up10", src: "/DSC_0732.jpg", alt: "Jucătorii Parma Rumena la sesiunea de incalzire", title: "Pregatirea pentru meci", category: "ECHIPA", layout: "portrait" },
  { id: "darius-trophy", src: "/darius.jpg", alt: "Darius ținând un trofeu de fotbal", title: "Pasiunea se vede.", category: "OAMENII NOȘTRI", layout: "portrait" },
  { id: "miclaus-trophies", src: "/miclaus.jpg", alt: "Miclăuș ținând două trofee de fotbal", title: "Munca devine amintire.", category: "OAMENII NOȘTRI", layout: "portrait" },
];
