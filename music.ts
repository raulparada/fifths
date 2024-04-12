export enum Note {
  C,
  Csharp,
  D,
  Dsharp,
  E,
  F,
  Fsharp,
  G,
  Gsharp,
  A,
  Asharp,
  B,
}

export const noteNames = {
  [Note.C]: "C",
  [Note.Csharp]: "C# / Db",
  [Note.D]: "D",
  [Note.Dsharp]: "D# / Eb",
  [Note.E]: "E",
  [Note.F]: "F",
  [Note.Fsharp]: "F# / Gb",
  [Note.G]: "G",
  [Note.Gsharp]: "G# / Ab",
  [Note.A]: "A",
  [Note.Asharp]: "A# / Bb",
  [Note.B]: "B",
};

export const noteColours = {
  [Note.C]: "#E735A4",
  [Note.Csharp]: "#84F989",
  [Note.D]: "#E7542D",
  [Note.Dsharp]: "#5782F4",
  [Note.E]: "#FBFC53",
  [Note.F]: "#9E26F6",
  [Note.Fsharp]: "##7FF84D",
  [Note.G]: "#E63649",
  [Note.Gsharp]: "#89F5F7",
  [Note.A]: "#EDA03A",
  [Note.Asharp]: "#5220F5",
  [Note.B]: "#AAF94E",
};

export const notesAmount = Object.keys(Note).length / 2;
console.log(`There are ${notesAmount} notes.`);

export const circleOfFifthsEnum = [];
export const circleOfFifthsNumbers = [];
let index = 0;
for (let i = 0; i < notesAmount; i++) {
  circleOfFifthsEnum.push(Note[index]);
  circleOfFifthsNumbers.push(index);
  index = (index + 7) % notesAmount;
}
console.log(`The circle of fifths is`, circleOfFifthsEnum);
