export type coord = {
  x: number,
  y: number
}

export type facing = "N" | "E" | "S" | "W";

export type unitProfile = {
  coords: coord | null,
  ggSpeed: number,
  facing: "N" | "E" | "S" | "W";
  // facing: facing;
}