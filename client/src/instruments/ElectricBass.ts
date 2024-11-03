import Sampler from './Sampler';

const MIDI_OFFSET = -24;
export default class ElectricBass extends Sampler {
    constructor() {
        super('bass-electric', [
            'G2',
            'E3',
            'G3',
            'E4',
            'G4',
        ]);
    }

    keyDown(midi: number, velocity = 100) {
        super.keyDown(midi + MIDI_OFFSET, velocity);
    }

    keyUp(midi: number) {
        super.keyUp(midi + MIDI_OFFSET);
    }
}
