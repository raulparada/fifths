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
  [Note.Csharp]: "C# / Db",
  [Note.D]: "#E7542D",
  [Note.Dsharp]: "D# / Eb",
  [Note.E]: "E",
  [Note.F]: "F",
  [Note.Fsharp]: "F# / Gb",
  [Note.G]: "#E63649",
  [Note.Gsharp]: "G# / Ab",
  [Note.A]: "#EDA03A",
  [Note.Asharp]: "A# / Bb",
  [Note.B]: "B",
};
