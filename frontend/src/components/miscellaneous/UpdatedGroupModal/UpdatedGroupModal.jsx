import { ViewIcon } from "@chakra-ui/icons"
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { ChatState } from "../../../Context/ChatProvider"
import { useState } from "react"
import UserBagdeItem from "../../UserAvatar/UserBadgeItem/UserBadgeItem"
import axios from "axios"
import UserListItem from "../../UserAvatar/UserListItem/UserListItem"

const UpdatedGroupModal = ({fetchAgain, setFetchAgain}) => {

    const {isOpen, onOpen, onClose} = useDisclosure()

    const {user, selectedChat, setSelectedChat} = ChatState()

    const[groupChatName, setGroupChatName] = useState()
    const[searchResult, setSearchResult] = useState([])
    const[loading, setLoading] = useState(false)
    const[renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

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
            setFetchAgain(!fetchAgain)

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

    const handleAddUser = async (_user) => {
        if(selectedChat.users.find(user => user._id === _user._id)){
            toast({
                title: "User already in Group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put(`http://localhost:5000/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: _user._id
            },
                config
            )

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)

        } catch (error) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: error.response.data.message ,
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
        finally{
            setLoading(false)
        }
    }

    const handleRemove = async(_user) => {
        console.log(_user)
        if(selectedChat.groupAdmin._id !== user._id && _user._id !== user._id){
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put(`http://localhost:5000/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: _user._id
            },
                config
            )

            user._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)

        } catch (error) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
        finally{
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if(!groupChatName){
            return
        }

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put(`http://localhost:5000/api/chat/rename`,
                {
                   chatId: selectedChat._id,
                   chatName: groupChatName
                },
                config
            )

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)


        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
        finally{
            setRenameLoading(false)
            setGroupChatName("")
        }
    }

    return(
        <>
            <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center" 
                >
                    {selectedChat.chatName}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {
                            selectedChat.users.map(u => (
                                <UserBagdeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))
                        }
                    </Box>

                    <FormControl display="flex">
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            variant={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant= "solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add User to Group"
                            mb={1}
                            variant={groupChatName}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>

                    {
                        loading ? 
                            <Spinner size="lg"/> :
                            searchResult.map( user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))

                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' onClick={() => handleRemove(user)}>
                         Leave Group
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdatedGroupModal