import Sampler from './Sampler';

export default class AcousticGuitar extends Sampler {
    constructor() {
        super('guitar-acoustic', [
            'A2',
            'C3',
            'A3',
            'C4',
            'A4',
            'C5',
            'A5',
            'C6',
        ]);
    }
}
