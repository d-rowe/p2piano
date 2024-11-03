import Sampler from './Sampler';

export default class ElectricGuitar extends Sampler {
    constructor() {
        super('guitar-electric', [
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
