import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react"
import { ChatState } from "../../Context/ChatProvider"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from "../../config/ChatLogics/ChatLogics"
import ProfieModal from "../miscellaneous/ProfieModal/ProfileModal"
import UpdatedGroupModal from "../miscellaneous/UpdatedGroupModal/UpdatedGroupModal"
import { useEffect, useState } from "react"
import axios from "axios"
import "../styles/styles.css"

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const {user, selectedChat, setSelectedChat} = ChatState()
  
    const toast = useToast()
  
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")


    const fetchMessages = async () => {
        if(!selectedChat) return

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const {data} = await axios.get(
                `http://localhost:5000/api/message/${selectedChat._id}`, 
                config
            )

            console.log(messages)
            setMessages(data)
            setLoading(false)
            
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }

    }

    useEffect(() => {
        fetchMessages()
    },[selectedChat])

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage){
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }

                const {data} = await axios.post(
                    `http://localhost:5000/api/message`, 
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    }, 
                    config
                )

                console.log(data)

                setMessages([...messages, data])
                
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Send the Message!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        // Typing Indicator Logic Here 
    }


    return(
        <>
            {
                selectedChat ? 
                    <>
                        <Text
                            fontSize={{base: "28px", md: "30px"}}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{base: "space-between"}}
                            alignItems="center"
                        >
                            <IconButton
                                display={{base: "flex", md: "none"}}
                                icon={<ArrowBackIcon/>}
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                !selectedChat.isGroupChat ? 
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfieModal user={getSenderFull(user, selectedChat.users)}/>
                                    </>  :
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdatedGroupModal 
                                            fetchAgain={fetchAgain} 
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                            }
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {/* { Message Here} */}
                            {
                                !loading ? 
                                    <Spinner
                                        size="lg"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto" 
                                    />
                                :
                                <div className="messages">
                                    {/* Message */}
                                </div>    
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message..."
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                    :
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting!
                        </Text>
                    </Box>
            }
        </>
    )
}

export default SingleChat