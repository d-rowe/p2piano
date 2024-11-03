import { KeyboardEvent, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    HStack,
    Button,
    useDisclosure,
    Input,
} from '@chakra-ui/react'
import ClientPreferences from '../lib/ClientPreferences';

type Props = {
    onSubmit: () => void,
};

function DisplayNameModal(props: Props) {
    const [displayName, setDisplayName] = useState<string>('');
    const { onClose } = useDisclosure();
    return (
        <>
            <Modal isOpen={true} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>create display name</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        <HStack p={6}>
                            <Input
                                placeholder='display name'
                                onChange={e => setDisplayName(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            <Button
                                mt={4}
                                bg='#151f21'
                                color='white'
                                rounded='md'
                                onClick={onSubmit}
                                disabled={!isDisplayNameValid()}
                            >
                                Ok
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            onSubmit();
        }

    }

    function isDisplayNameValid(): boolean {
        return displayName.length >= 3;
    }

    function onSubmit() {
        if (!isDisplayNameValid()) {
            return;
        }
        ClientPreferences.setDisplayName(displayName);
        onClose();
        props.onSubmit();
    }
}

export default DisplayNameModal;
