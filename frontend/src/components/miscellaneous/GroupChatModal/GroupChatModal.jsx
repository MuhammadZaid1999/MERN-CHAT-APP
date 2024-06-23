import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { ChatState } from "../../../Context/ChatProvider"
import axios from "axios"
import UserListItem from "../../UserAvatar/UserListItem/UserListItem"
import UserBagdeItem from "../../UserAvatar/UserBadgeItem/UserBadgeItem"

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const[groupChatName, setGroupChatName] = useState()
    const[selectedUsers, setSelectedUsers] = useState([])
    const[searchResult, setSearchResult] = useState([])
    const[loading, setLoading] = useState(false)

    const toast = useToast()

    const {user, chats, setChats} = ChatState()

    const handleSearch = async (query) => {
        if(!query)
            return

        try {
            setLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`http://localhost:5000/api/user?search=${query}`,
                config
            )
            setSearchResult(data)

        } catch (error) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: "Failed to Load the search Result!",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
        finally{
            setLoading(false)
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already Added!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }


    const handleDelete = (user) => {
        const deleteUser = selectedUsers.filter(_user => _user !== user)
        setSelectedUsers(deleteUser)
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the Fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post(`http://localhost:5000/api/chat/group`,
                {
                   name: groupChatName,
                   users: JSON.stringify(selectedUsers.map(u => u._id))
                },
                config
            )

            setChats([data, ...chats])
            onClose()

            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        
        } catch (error) {
            toast({
                title: "Failed to Create Group Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
    }
    
    return (
        <>
        <span onClick={onOpen}>
            {children}
        </span>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >
                Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
            >
                <FormControl>
                    <Input
                        placeholder="Chat Name"
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input
                        placeholder="Add Users eg: John, Piyush, Jane"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>

                {/* Selected Users */}
                <Box w="100%" display="flex" flexWrap="flex">
                    {
                        selectedUsers.map(user => (
                            <UserBagdeItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleDelete(user)}
                            />
                        ))
                    }
                </Box>

                {
                    loading ?
                        <div>Loading</div>
                        :
                        searchResult?.slice(0,4) 
                        .map(user => (
                            <UserListItem
                                key={user._id}
                                user={user} 
                                handleFunction={() => handleGroup(user)}
                            />
                        ))
                }
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                    Create Chat
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default GroupChatModal