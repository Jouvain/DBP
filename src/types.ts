export type coord = {
  x: number,
  y: number
}

export type unitProfile = {
  coords: coord | null,
  ggSpeed: number,
  facing: "N" | "E" | "S" | "W";
}