import { select } from 'd3-selection';
import * as Tone from 'tone';
import {
  notes,
  chords,
  size,
  pointRadius,
  centerRadius,
  padding,
  textPadding,
  polygonStroke,
  bpm
} from './data.js';

import './style.scss';

const noteInChord = function noteInChord({ note, enharmonic, chord }) {
  return chord.indexOf(note) > -1 || chord.indexOf(enharmonic) > -1
}

const noteEquals = function noteEquals(x, y) {
  const defaultNote = notes.find(
    ({ note, enharmonic }) => y === note || y === enharmonic
  );
  return defaultNote.note === x;
}

const renderCircle = function renderCircle({
  element,
  showFlats = true,
  chordNotes
} = {}) {
  function getX(i, offset = 0) {
    return size / 2
      + Math.cos(2 * Math.PI / notes.length * i - Math.PI / 2)
      * (size / 2 - padding + offset);
  }

  function getY(i, offset = 0) {
    return size / 2
      + Math.sin(2 * Math.PI / notes.length * i - Math.PI / 2)
      * (size / 2 - padding + offset);
  }

  function polygonPoints(chordNotes) {
    return chordNotes.map(p => {
      const index = notes.findIndex(
        note => note.note === p || note.enharmonic === p
      );
      return `${getX(index)}, ${getY(index)}`;
    }).join(' ');
  }

  const svg = select(element)
    .append('svg')
    .lower()
    .attr('width', size)
    .attr('height', size)
    .attr('viewBox', `0 0 ${size} ${size}`);

  svg.append('circle')
    .attr('class', 'circle')
    .attr('cx', size / 2)
    .attr('cy', size / 2)
    .attr('r', size / 2 - padding);

  const center = svg.append('circle')
    .attr('class', 'center')
    .attr('cx', size / 2)
    .attr('cy', size / 2)
    .attr('r', centerRadius);

  const polygonGroup = svg.append('g')
    .attr('class', 'polygons');

  const pointGroup = svg.append('g')
    .attr('class', 'points');

  pointGroup
    .selectAll('circle')
    .data(notes)
    .enter()
    .append('circle')
      .attr('cx', (d, i) => getX(i))
      .attr('cy', (d, i) => getY(i))
      .attr('class',
        d => noteInChord({ ...d, chord: chordNotes}) ? 'selected' : ''
      )
      .attr('data-note', d => d.note)
      .attr('r', pointRadius);

  const labelsGroup = svg.append('g')
    .attr('class', 'labels');

  labelsGroup
    .selectAll('circle')
    .data(notes)
    .enter()
    .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => getX(i, textPadding))
      .attr('y', (d, i) => getY(i, textPadding))
      .attr('dy', 5)
      .attr('class',
        d => noteInChord({ ...d, chord: chordNotes}) ? 'selected' : ''
      )
      .attr('data-note', d => d.note)
      .text(
        d => showFlats && d.note.indexOf('#') > -1 && d.enharmonic ? d.enharmonic : d.note
      );

  polygonGroup.append('polygon')
    .attr('points', polygonPoints(chordNotes))
    .attr('fill', 'none')
    .attr('stroke-width', polygonStroke);
}

document.addEventListener('DOMContentLoaded', () => {
  Tone.Transport.bpm.value = bpm;
  const synth = new Tone.Synth().toDestination();

  let sequence = null;
  let started = false;
  let playingCircleIndex = -1;

  const $circles = document.querySelectorAll('.circle');

  $circles.forEach((el, i) => {
    const name = el.dataset.name;
    const chordNotes = el.dataset.chordNotes.split(',');
    renderCircle({
      chordNotes,
      element: el.querySelector('figure')
    });

    const $labels = el.querySelectorAll('[data-note]');

    el.addEventListener('click', () => {
      if (!started) {
        Tone.start();
        started = true;
      }
      if (sequence) {
        sequence.stop();
        sequence.clear();
      }
      sequence = new Tone.Sequence((time, note) => {
        synth.triggerAttackRelease(`${note}3`, '16n');
        $labels.forEach(el => el.classList.toggle('is-current', noteEquals(el.dataset.note, note)));
      }, chordNotes).start(0);

      $circles.forEach(el => el.classList.remove('is-playing'));

      if (playingCircleIndex === i) {
        Tone.Transport.stop();
        playingCircleIndex = -1;
        $labels.forEach(el => el.classList.remove('is-current'));
        return;
      }
      el.classList.add('is-playing');
      Tone.Transport.start();
      playingCircleIndex = i;
    });
  });
});
