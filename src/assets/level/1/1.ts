import type Level from "../../../lib/types/Level";

export default {
    winningPoints: 1,
    track: "no-track",
    type: "island",
    lower: {
        "_": "0 1 2 3 4 5 6 7 8 9 A B C D E F",
        "0": ". . . . . . . . . . . . . . . .",
        "1": ". . . . . . . . . . . . . . . .",
        "2": ". . . . . . . . . . . . . . . .",
        "3": ". . . . . . . . . . . . . . . .",
        "4": ". . . . . . . . . . . . . . . .",
        "5": ". . . . . . . . . . . . . . . .",
        "6": ". . . . . . . . . . . . . . . .",
        "7": ". . . s s s s s s s s s s . . .",
        "8": ". . . . . . . . . . s s . . . .",
        "9": ". . . . . . . . . . . . . . . .",
        "A": ". . . . . . . . . . . . . . . .",
        "B": ". . . . . . . . . . . . . . . .",
        "C": ". . . . . . . . . . . . . . . .",
        "D": ". . . . . . . . . . . . . . . .",
        "E": ". . . . . . . . . . . . . . . .",
        "F": ". . . . . . . . . . . . . . . ."
    },
    upper: {
        "_": "0 1 2 3 4 5 6 7 8 9 A B C D E F",
        "0": ". . . . . . . . . . . . . . . .",
        "1": ". . . . . . . . . . . . . . . .",
        "2": ". . . . . . . . . . . . . . . .",
        "3": ". . . . . . . . . . . . . . . .",
        "4": ". . . . . . . . . . . . . . . .",
        "5": ". . . . . . . . . . . . . . . .",
        "6": ". . . . . . . . . . . . . . . .",
        "7": ". . . p . b . . . . . . 1 . . .",
        "8": ". . . . . . . . . . . . . . . .",
        "9": ". . . . . . . . . . . . . . . .",
        "A": ". . . . . . . . . . . . . . . .",
        "B": ". . . . . . . . . . . . . . . .",
        "C": ". . . . . . . . . . . . . . . .",
        "D": ". . . . . . . . . . . . . . . .",
        "E": ". . . . . . . . . . . . . . . .",
        "F": ". . . . . . . . . . . . . . . ."
    }
} as Level;
