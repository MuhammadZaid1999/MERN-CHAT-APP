import { ViewIcon } from "@chakra-ui/icons"
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"

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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        sdsadas
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
export default ProfieModal