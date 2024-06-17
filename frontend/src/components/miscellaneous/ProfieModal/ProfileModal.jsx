import { ViewIcon } from "@chakra-ui/icons"
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image, Text} from "@chakra-ui/react"

const ProfieModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return(
        <> 
            {children ? 
                <span onClick={onOpen}>{children}</span>
                :
                <IconButton
                 d={{ base: "flex"}}
                 icon={<ViewIcon/>}
                 onClick={onOpen}
                />
            } 

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                        textAlign="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                        textAlign="center"
                        alignContent="center"
                    >
                        <Image
                            boxSize="150px"
                            borderRadius="full"
                            display="inline"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px"}}
                            fontFamily="Work sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
export default ProfieModal