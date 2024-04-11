const canvas = document.getElementById("fifths");
const ctx = canvas.getContext("2d");
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
const noteNames = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B'];
const circleOfFifths = [];
const circleOfFifthsNumbers = [];
let index = 0;
for (let i = 0; i < noteNames.length; i++) {
    circleOfFifths.push(noteNames[index]);
    circleOfFifthsNumbers.push(index);
    index = (index + 7) % noteNames.length;
}
console.log(circleOfFifths);
ctx.translate(width / 2, height / 2);
// let currentNote = null;
const pressedNotes = new Set();
// function drawCircle() {
//   ctx.clearRect(width / 2, height / 2, width, height);
//   for (let i = 0; i < noteNames.length; i++) {
//     const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
//     const x = radius * Math.cos(angle);
//     const y = radius * Math.sin(angle);
//     ctx.beginPath();
//     ctx.arc(x, y, 20, 0, 2 * Math.PI);
//     ctx.fillStyle = pressedNotes.has(circleOfFifthsNumbers[i]) ? 'red' : 'white';
//     ctx.fill();
//     ctx.stroke();
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(circleOfFifths[i], x, y);
//   }
// }
function drawCircle() {
    ctx.clearRect(-width / 2, -height / 2, width, height);
    const sortedNotes = Array.from(pressedNotes).map(Number).sort((a, b) => a - b);
    ctx.beginPath();
    for (let i = 0; i < sortedNotes.length; i++) {
        const angle = (sortedNotes[i] / 12) * 2 * Math.PI - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fill();
    for (let i = 0; i < circleOfFifths.length; i++) {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = pressedNotes.has(i) ? 'red' : 'white';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
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
function onMIDIMessage(event) {
    // Main.
    const status = event.data[0];
    if (status === 144) {
        const note = event.data[1];
        const frequency = 440 * Math.pow(2, (note - 69) / 12); // Convert MIDI note to frequency
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle'; // or 'sawtooth' or 'triangle'
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillators.set(note, oscillator);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.1; // Adjust volume
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = 'lowshelf';
        oscillator.connect(gainNode);
        gainNode.connect(filterNode);
        filterNode.frequency.value = 1000;
        filterNode.gain.value = -15;
        pressedNotes.add(note % 12);
        console.log(pressedNotes);
        // currentNote = midiNoteToName(note);
        drawCircle();
        // // Debug info.
        // let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
        // for (const character of event.data) {
        //   str += `0x${character.toString(16)} `;
        // }
        // console.log(str);    
    }
    else if (status === 128) {
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
