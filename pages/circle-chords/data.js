const notes = [
  { note: 'C' },
  { note: 'C#', enharmonic: 'Db' },
  { note: 'D' },
  { note: 'D#', enharmonic: 'Eb' },
  { note: 'E' },
  { note: 'F' },
  { note: 'F#', enharmonic: 'Gb' },
  { note: 'G' },
  { note: 'G#', enharmonic: 'Ab' },
  { note: 'A', enharmonic: 'Bbb' },
  { note: 'A#', enharmonic: 'Bb' },
  { note: 'B' }
];

const chords = [
  {
    name: 'maj',
    notes: ['C', 'E', 'G']
  },
  {
    name: 'min',
    notes: ['C', 'Eb', 'G']
  },
  {
    name: 'dim',
    notes: ['C', 'Eb', 'Gb']
  },
  {
    name: 'aug',
    notes: ['C', 'E', 'G#']
  },
  {
    name: 'maj7',
    notes: ['C', 'E', 'G', 'B']
  },
  {
    name: '7',
    notes: ['C', 'E', 'G', 'Bb']
  },
  {
    name: 'minmaj7',
    notes: ['C', 'Eb', 'G', 'B']
  },
  {
    name: 'm7',
    notes: ['C', 'Eb', 'G', 'Bb']
  },
  {
    name: 'm7b5',
    notes: ['C', 'Eb', 'Gb', 'Bb']
  },
  {
    name: 'dim7',
    notes: ['C', 'Eb', 'Gb', 'Bbb']
  }
];

module.exports = {
  chords,
  notes,
  size: 300,
  pointRadius: 5,
  centerRadius: 2,
  padding: 40,
  textPadding: 30,
  bpm: 100,
  polygonStroke: 3,
  title: "Circle representation of chord tones",
  description: "Displaying the notes of a chord around an equal tempered circle."
};
