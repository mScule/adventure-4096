import type Level from "../../../lib/types/Level"
import LevelWorld from "../../../lib/types/LevelWorld";

export default {
    winningPoints: 8,
    world: LevelWorld.Island,
    lower: {
        "_": "0 1 2 3 4 5 6 7 8 9 A B C D E F",
        "0": ". . . . . . . . . . . . . . . .",
        "1": ". . . . . . . . . . . . . . . .",
        "2": ". . . . . . s s . . . . . . . .",
        "3": ". . . . s s s s s s s s . . . .",
        "4": ". . . . s s s s . s s s . . . .",
        "5": ". . . . s s s s s s s s . . . .",
        "6": ". . . . s s s s s s s s . . . .",
        "7": ". . . . . . . . . . s s . . . .",
        "8": ". . . . . . . . . . s s s . . .",
        "9": ". . . . . s s s s s s s s . . .",
        "A": ". . . . . s s s s s s s . . . .",
        "B": ". . . . . . . . . . . . . . . .",
        "C": ". . . . . . . . . . . . . . . .",
        "D": ". . . . . . . . . . . . . . . .",
        "E": ". . . . s s s . . . . . . . . .",
        "F": ". . . . . . . . . . . . . . . ."
    },
    upper: {
        "_": "0 1 2 3 4 5 6 7 8 9 A B C D E F",
        "0": ". . . . . . . . . . . . . . . .",
        "1": ". . . . . . . . . . . . . . . .",
        "2": ". . . . . . . . . . . . . . . .",
        "3": ". . . . 1 b 1 . s . . 1 . . . .",
        "4": ". . . . B . . . . . . b . . . .",
        "5": ". . . . 1 b 1 . s . . 1 . . . .",
        "6": ". . . . s s . . s s b s . . . .",
        "7": ". . . . . . . . . . . . . . . .",
        "8": ". . . . . . . . . . . . . . . .",
        "9": ". . . . . . . . p . . b . . . .",
        "A": ". . . . . . . . . . . . . . . .",
        "B": ". . . . . . . . . . . . . . . .",
        "C": ". . . . . . . . . . . . . . . .",
        "D": ". . . . . . . . . . . . . . . .",
        "E": ". . . . 1 . 1 . . . . . . . . .",
        "F": ". . . . . . . . . . . . . . . ."
    }
} as Level;
