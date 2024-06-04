import React from "react";
import { 
    Box, 
    Container, 
    Text,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel 
} from "@chakra-ui/react";

const HomePage = () => {
    return(
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                alignContent="center"
                textAlign="center"
                p={3}
                bg={"white"}
                w="100%"
                m="50px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans">
                    Tack-A-Tive
                </Text>
            </Box>
            <Box 
                bg="white" 
                w="100%" 
                p={4}
                borderRadius="lg"
                borderWidth="1px"
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <p>one!</p>
                        </TabPanel>
                        <TabPanel>
                        <p>two!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage;