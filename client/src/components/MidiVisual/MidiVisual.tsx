import React, { PureComponent } from 'react';
import MidiVisualRenderer from './MidiVisualRenderer';
import { Box } from '@chakra-ui/react';
import Toolbar from '../Toolbar';

import type { MidiRange, Note } from '../../constants';

type Props = {
    notes: Note[],
    midiRange: MidiRange,
};

export default class MidiVisual extends PureComponent<Props> {
    private containerRef = React.createRef<HTMLDivElement>();
    private renderer?: MidiVisualRenderer;
    private activeNotes = new Map<number, Note>();

    componentDidMount() {
        const container = this.containerRef.current;
        const { midiRange } = this.props;
        if (container && !this.renderer) {
            this.renderer = new MidiVisualRenderer(container, midiRange);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { midiRange } = this.props;
        const { midiRange: prevMidiRange } = prevProps;

        if (prevMidiRange[0] !== midiRange[0] || prevMidiRange[1] !== midiRange[1]) {
            this.renderer?.setMidiRange(midiRange);
        }

        const currentNotes = this.props.notes.reduce((arr, note) => arr.set(note.midi, note),
            new Map<number, Note>()
        );

        this.activeNotes.forEach(note => {
            const currentEntry = currentNotes.get(note.midi);
            if (!currentEntry || currentEntry.peerId !== note.peerId) {
                this.activeNotes.delete(note.midi);
                this.renderer?.noteOff(note.midi);
            }
        });

        currentNotes.forEach(note => {
            const prevEntry = this.activeNotes.get(note.midi);
            if (!prevEntry) {
                this.activeNotes.set(note.midi, note);
                this.renderer?.noteOn(note.midi, note.color || 'blue');
            }
        });
    }

    render() {
        return (
            <Box
                w='100%'
                h='100%'
                pos='relative'
                ref={this.containerRef}
            >
                <Toolbar />
            </Box>
        );
    }
}
