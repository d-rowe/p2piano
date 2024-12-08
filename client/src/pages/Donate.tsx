import {Box, Flex, Heading, Link, Text} from '@chakra-ui/react';
import GeneralPage from '../components/GeneralPage';

const Donate = () => (
    <GeneralPage>
        <Flex
            direction='column'
            alignItems='center'
            margin='32px'
        >
            <Box maxWidth='768px'>
            <Heading padding='16px 0' justifySelf='center'>
                Donate
            </Heading>
            <Text>
                This project is provided free of charge, advertisements, and tracking.
                I don't accept donations, but if you'd like to make music more accessible
                please consider donating to <Link textDecoration='underline' href='https://www.seattlejazzed.org/donate'>Seattle JazzED</Link> or a music education non-profit working in your community.
            </Text>
            </Box>
        </Flex>
    </GeneralPage>
);

export default Donate;
