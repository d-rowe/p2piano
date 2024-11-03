export default class NoteRect {
    midi: number;
    color: string;
    y: number = 0;
    height: number = 0;

    constructor(midi: number, color: string) {
        this.midi = midi;
        this.color = color;
    }
}
