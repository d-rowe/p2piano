import {
    Box,
    Button,
    ButtonGroup,
    Select,
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import { getMyUser } from '../lib/WorkspaceHelper';
import Icon from './Icon';
import {
    midiRangeZoomIn,
    midiRangeZoomOut,
    midiRangeShiftLeft,
    midiRangeShiftRight,
    updateInstrument,
} from '../actions/WorkspaceActions';
import { InstrumentType } from '../instruments/Instrument';

import type { User } from '../lib/workspaceTypes';

const INSTRUMENTS: Record<InstrumentType, string> = {
    [InstrumentType.PIANO]: 'Piano',
    [InstrumentType.SYNTH]: 'Synth',
    [InstrumentType.ELECTRIC_GUITAR]: 'Electric guitar',
    [InstrumentType.ACOUSTIC_GUITAR]: 'Acoustic guitar',
    [InstrumentType.ELECTRIC_BASS]: 'Electric bass',
};

type Props = {
    user: User | null | undefined,
};

function Toolbar(props: Props) {
    const { user } = props;
    const { instrument } = user || {};

    return (
        <Box
            pos='absolute'
            right='0'
            h='14px'
        >
            <ButtonGroup
                spacing='0'
                size='sm'
            >
                <Select
                    size='sm'
                    color='white'
                    value={instrument}
                    defaultValue={InstrumentType.PIANO}
                    onChange={e => {
                        updateInstrument(e.target.value as InstrumentType)
                    }}
                >
                    {Object.entries(INSTRUMENTS).map(([type, title], i) => (
                        <option
                            value={type}
                            key={i}
                        >
                            {title}
                        </option>
                    ))}
                </Select>
                <Button p={0} onClick={midiRangeShiftLeft}>
                    <Icon name='arrow-left' />
                </Button>
                <Button p={0} onClick={midiRangeShiftRight}>
                    <Icon name='arrow-right' />
                </Button>
                <Button p={0} onClick={midiRangeZoomOut}>
                    <Icon name='zoom-out' />
                </Button>
                <Button p={0} onClick={midiRangeZoomIn}>
                    <Icon name='zoom-in' />
                </Button>
            </ButtonGroup>
        </Box >
    );
}

function mapStateToProps() {
    return {
        user: getMyUser(),
    };
}

export default connect(mapStateToProps)(Toolbar);
