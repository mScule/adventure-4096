import boolean from "../parse/boolean";

const levelKey = (levelIndex: number): string => `level-${levelIndex}`;

export function setLevelOpen(levelIndex: number) {
  localStorage.setItem(levelKey(levelIndex), boolean.toString(true));
}

export function isLevelOpen(levelIndex: number) {
  return boolean.fromString(localStorage.getItem(levelKey(levelIndex)));
}
