import {
    Text,
    Heading,
    Box,
    Center,
    Input,
    Stack,
    HStack,
    Button,
    Spinner,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { createNewRoom, getRoom } from '../clients/RoomClient';
import { useCallback, useState } from 'react';

import type { ChangeEvent } from 'react';

export default function RoomCard() {
    const [isRoomError, setRoomError] = useState(false);
    const [isRoomCreating, setRoomCreating] = useState(false);
    const navigate = useNavigate();

    const navigateToRoom = useCallback((roomId: string) => navigate(`/${roomId}`), [navigate]);

    const createRoom = useCallback(async () => {
        setRoomCreating(true);
        const {data: room} = await createNewRoom();
        // @ts-ignore
        navigateToRoom(room.roomId);
    }, [navigateToRoom]);

    const onRoomCodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const roomId = e.target.value.toLowerCase();
        if (roomId.length !== 5) {
            setRoomError(false);
            return;
        }

        try {
            await getRoom(roomId);
        } catch {
            setRoomError(true);
            return;
        }

        setRoomError(false);

        navigateToRoom(roomId);
    }

    return (
        <Center py={6}>
            <Box
                maxW='400px'
                w='full'
                bg='white'
                boxShadow='2xl'
                rounded='md'
                overflow='hidden'
            >
                <Center>
                    <Stack>
                        <Heading pt={4} textAlign='center'>p2piano</Heading>
                        <HStack p={6}>
                            <Input
                                placeholder='join room code'
                                size='lg'
                                maxLength={5}
                                width='10rem'
                                textAlign='center'
                                onChange={onRoomCodeChange}
                                isInvalid={isRoomError}
                                errorBorderColor='red.300'
                                textTransform='lowercase'
                            />
                            <Text>or</Text>
                            <Button
                                mt={4}
                                bg='#151f21'
                                color='white'
                                rounded='md'
                                onClick={createRoom}
                                disabled={isRoomCreating}
                            >
                                {
                                    isRoomCreating
                                        ? <Spinner />
                                        : 'create new room'
                                }
                            </Button>
                        </HStack>
                    </Stack>
                </Center>
            </Box>
        </Center>
    );
}
