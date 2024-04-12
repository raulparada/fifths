const canvas = document.getElementById("fifths") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

/* 
TODO
- Clean up a bit
- Sound
- Colors
*/

const audioContext = new AudioContext();
const oscillators = new Map();

const width = canvas.width;
const height = canvas.height;
const radius = Math.min(width, height) / 2;

enum Note {
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

const noteNames = {
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

const notesAmount = Object.keys(Note).length / 2;
console.log(`There are ${notesAmount} notes.`);

const circleOfFifths = [];
const circleOfFifthsNumbers = [];
let index = 0;
for (let i = 0; i < notesAmount; i++) {
  circleOfFifths.push(Object.values(noteNames)[index]);
  circleOfFifthsNumbers.push(index);
  index = (index + 7) % notesAmount;
}

console.log(circleOfFifths);

ctx.translate(width / 2, height / 2);

// let currentNote = null;
const pressedNotes: Set<number> = new Set();

function drawCircle() {
  ctx.clearRect(-width / 2, -height / 2, width, height);

  const sortedNotes = Array.from(pressedNotes)
    .map((e) => Number(circleOfFifthsNumbers[e]))
    .sort((a, b) => a - b);
  console.log("sortedNotes", sortedNotes);

  ctx.beginPath();
  for (let i = 0; i < sortedNotes.length; i++) {
    const angle = (sortedNotes[i] / 12) * 2 * Math.PI - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fill();

  for (let i = 0; i < notesAmount; i++) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = pressedNotes.has(circleOfFifthsNumbers[i])
      ? "red"
      : "white";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(circleOfFifths[i], x, y);
  }
}

// MIDI
function midiNoteToName(note) {
  const noteName = noteNames[note % 12];
  console.log(`MIDI note ${note} corresponds to key ${noteName}`);
  return noteName;
}

function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  startLoggingMIDIInput(midiAccess);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDIMessage(event: MIDIMessageEvent) {
  // Main.
  const status = event.data[0];

  if (status === 144) {
    const note = event.data[1];
    pressedNotes.add(note % 12);

    const frequency = 440 * Math.pow(2, (note - 69) / 12); // Convert MIDI note to frequency
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // or 'sawtooth' or 'triangle'
    oscillator.frequency.value = frequency;
    oscillators.set(note, oscillator);

    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = "lowshelf";
    filterNode.frequency.value = 1000;
    filterNode.gain.value = -5;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5 / (pressedNotes.size + 3 || 1);

    oscillator.connect(gainNode);
    oscillator.connect(filterNode);
    gainNode.connect(audioContext.destination);
    console.log(pressedNotes);
    oscillator.start();
    drawCircle();

    // // Debug info.
    // let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    // for (const character of event.data) {
    //   str += `0x${character.toString(16)} `;
    // }
    // console.log(str);
  } else if (status === 128) {
    const note = event.data[1];
    const oscillator = oscillators.get(note);
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillators.delete(note);
    }
    // Note off event
    pressedNotes.delete(note % 12);
  }
}

function startLoggingMIDIInput(midiAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

drawCircle();

// Keyboard
// Map keyboard keys to MIDI notes
const keyToMidi = {
  // w: 61, // C#4
  a: 60, // C4
  s: 62, // D4
  d: 64, // E4
  f: 65, // F4
  g: 67, // G4
  h: 69, // A4
  j: 71, // B4
  k: 72, // C5
  // ... add more keys
};

// Create a new MIDI event
function createMidiEvent(note, velocity, type) {
  return {
    data: [type, note, velocity],
  };
}

// Handle keydown event
window.addEventListener("keydown", (event) => {
  if (event.repeat) return; // Ignore key repeat
  const note = keyToMidi[event.key.toLowerCase()];
  if (note !== undefined) {
    const midiEvent = createMidiEvent(note, 127, 144); // 144 is note on
    onMIDIMessage(midiEvent);
  }
});

// Handle keyup event
window.addEventListener("keyup", (event) => {
  const note = keyToMidi[event.key];
  if (note !== undefined) {
    const midiEvent = createMidiEvent(note, 127, 128); // 128 is note off
    onMIDIMessage(midiEvent);
  }
});
