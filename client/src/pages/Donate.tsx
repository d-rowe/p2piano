import {Box, Flex, Heading, Link, Text} from '@chakra-ui/react';
import GeneralPage from '../components/GeneralPage';

const Donate = () => (
    <GeneralPage>
        <Flex
            direction='column'
            alignItems='center'
            justifyContent='center'
            margin='32px'
        >
            <Box maxWidth='768px'>
            <Heading
                padding='16px 0'
                textAlign='center'
                fontFamily='"Young Serif", serif'
            >
                donate
            </Heading>
            <Text fontSize='l'>
                this project is provided free of charge, advertisements, and tracking.
                while I don't need donations, please consider making music more accessible by donating to <Link textDecoration='underline' href='https://www.seattlejazzed.org/donate'>Seattle JazzED</Link> or a music education non-profit working in your community.
            </Text>
            </Box>
        </Flex>
    </GeneralPage>
);

export default Donate;
