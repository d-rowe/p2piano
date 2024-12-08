import {Flex, Link} from '@chakra-ui/react';

export default function Footer() {
    return (
        <Flex justifyContent='center'>
            <span>
                made by {' '}
                <Link
                    textDecoration='underline'
                    href='https://github.com/d-rowe'
                >
                    d-rowe
                </Link>
            </span>
        </Flex>
    );
}
