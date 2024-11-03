import NoteRect from './NoteRect';

import type { MidiRange } from '../../constants';

const SCROLL_SPEED = 0.33;
const TOP_RANGE_OFFSET = 1.6;
const RANGE_ANIMATION_DURATION = 250;

export default class MidiVisualRenderer {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private activeMidi = new Set<number>();
    private noteRectsByMidi = new Map<number, NoteRect[]>();
    private lastRenderTime = 0;
    private midiRange!: MidiRange;
    private targetMidiRange: MidiRange | null = null;
    private animationStartTime: number | null = null;

    constructor(container: HTMLElement, midiRange: MidiRange) {
        this.container = container;
        this.midiRange = midiRange;

        this.canvas = document.createElement('canvas')
        this.canvas.setAttribute('style', 'width: 100%; height: 100%;');
        container.append(this.canvas);
        window.addEventListener('resize', this.sizeCanvas.bind(this));
        this.sizeCanvas();
        this.render = this.render.bind(this);
        window.requestAnimationFrame(this.render);
    }

    noteOn(midi: number, color: string): void {
        this.activeMidi.add(midi);
        if (!this.noteRectsByMidi.get(midi)) {
            this.noteRectsByMidi.set(midi, []);
        }
        const midiNoteRects = this.noteRectsByMidi.get(midi);
        midiNoteRects?.push(new NoteRect(midi, color));
    }

    noteOff(midi: number): void {
        this.activeMidi.delete(midi);
    }

    setMidiRange(midiRange: MidiRange) {
        this.targetMidiRange = midiRange;
    }

    private render(time: number): void {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        const { width, height } = this.canvas;
        ctx.clearRect(0, 0, width, height);

        const distDelta = time - this.lastRenderTime;
        const scrollDelta = distDelta * SCROLL_SPEED;

        this.easeMidiRange(time);

        this.noteRectsByMidi.forEach((midiNoteRects, midi) => {
            const offscreenNoteRects = new Set<NoteRect>();
            midiNoteRects.forEach((noteRect, i) => {
                const isMostRecent = i === midiNoteRects.length - 1;
                ctx.fillStyle = noteRect.color;
                noteRect.y += scrollDelta;
                if (isMostRecent && this.activeMidi.has(midi)) {
                    noteRect.height += scrollDelta;
                } else {
                    const bottom = noteRect.y - noteRect.height;
                    if (bottom > height) {
                        offscreenNoteRects.add(noteRect);
                        return;
                    }
                }
                const dimensions = this.getDimension(noteRect);
                ctx.fillRect(dimensions.x, height - noteRect.y, dimensions.width, noteRect.height);
            });
            // clean up notes that are now off-screen
            const newMidiNoteRects = midiNoteRects.filter(noteRect => !offscreenNoteRects.has(noteRect));
            this.noteRectsByMidi.set(midi, newMidiNoteRects);
        });

        this.lastRenderTime = time;
        window.requestAnimationFrame(this.render);
    }

    private sizeCanvas() {
        const { clientWidth, clientHeight } = this.container;
        this.canvas.width = clientWidth * window.devicePixelRatio;
        this.canvas.height = clientHeight * window.devicePixelRatio;
    }

    private getDimension(noteRect: NoteRect): { width: number, x: number } {
        const [start, end] = this.midiRange;
        const width = this.canvas.width / (end - start + TOP_RANGE_OFFSET);
        const normalizedMidi = noteRect.midi - start;
        return {
            width,
            x: normalizedMidi * width
        };
    }

    private easeMidiRange(time: number) {
        if (!this.targetMidiRange) {
            return;
        }

        if (!this.animationStartTime) {
            this.animationStartTime = time;
        }

        const animationProgress = Math.max((time - this.animationStartTime) / RANGE_ANIMATION_DURATION, 0);
        const startDrift = Math.abs(this.targetMidiRange[0] - this.midiRange[0]);
        const endDrift = Math.abs(this.targetMidiRange[1] - this.midiRange[1]);
        const startStep = startDrift * animationProgress;
        const endStep = endDrift * animationProgress;

        if (startDrift < startStep && endDrift < endStep) {
            this.midiRange = this.targetMidiRange;
            this.targetMidiRange = null;
            this.animationStartTime = null;
            return;
        }

        const startDiff = this.targetMidiRange[0] - this.midiRange[0];
        const endDiff = this.targetMidiRange[1] - this.midiRange[1];
        const absStartDiff = Math.abs(startDiff);
        const absEndDiff = Math.abs(endDiff);
        let newStart = this.midiRange[0];
        let newEnd = this.midiRange[1];
        if (absStartDiff > startStep) {
            const startDir = startDiff / absStartDiff;
            newStart += startDrift * animationProgress * startDir;
        }
        if (absEndDiff > endStep) {
            const endDir = endDiff / absEndDiff;
            newEnd += endDrift * animationProgress * endDir;
        }
        this.midiRange = [newStart, newEnd];
    }
}
