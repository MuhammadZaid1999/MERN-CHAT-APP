import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Button, Tooltip, Text, MenuButton, Menu, Avatar, MenuList, MenuItem, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { ChatState } from "../../../Context/ChatProvider"
import ProfieModal from "../ProfieModal/ProfileModal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ChatLoading from "../../ChatLoading/ChatLoading"
import UserListItem from "../../UserAvatar/UserListItem/UserListItem"

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResut, setSearchResut] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const {user, setSelectedChat, chats, setChats} = ChatState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const LogoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const handleSearch = async () => {
        if(!search){
            toast({
                title: "Please Enter sometthing in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
            return
        }

        try{
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`,
                config
            )
            setSearchResut(data)
        }
        catch(error){
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

    const accessChat = async (userId) => {
        try{
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post(`http://localhost:5000/api/chat`,
                {userId},
                config
            )

            if(!chats.find(c => c._id === data._id))
                setChats([data, ...chats])

            setSelectedChat(data)
            onClose()
        }
        catch(error){
            toast({
                title: "Error fetching the chat!",
                status: "error",
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
        finally{
            setLoadingChat(false)
        }
    }


    return(
        <>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >
            <Tooltip 
                label="Search User to Chat"
                hasArrow
                placement="bottom-end"
            >
                <Button variant="ghost" onClick={onOpen}>
                    <i class="fas fa-search"></i>
                    <Text d={{base: "none", md: "flex"}} px="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>

            <Text fontSize="2xl" fontFamily="Work sans">
                Talk-A-Tive
            </Text>

            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" m={1}/>
                    </MenuButton>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar 
                            size="sm" 
                            cursor="pointer" 
                            name={user.name}
                            src={user.pic}
                        />
                    </MenuButton>
                    <MenuList>
                        <ProfieModal user={user}>
                            <MenuItem>MyProfile</MenuItem>
                        </ProfieModal>
                        <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                    <Box display="flex"  pb={2}>
                        <Input
                            placeholder='Search by name or email'
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {
                        loading ? 
                            <ChatLoading/>
                        :
                            searchResut.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}
                                />
                            ))   
                    }
                    {loadingChat && <Spinner ml="auto" display="flex"/>}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    )
}
export default SideDrawer