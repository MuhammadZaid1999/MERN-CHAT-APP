import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Button, Tooltip, Text, MenuButton, Menu, Avatar, Flex, Spacer, MenuList, MenuItem } from "@chakra-ui/react"
import { useState } from "react"
import { ChatState } from "../../../Context/ChatProvider"
import ProfieModal from "../ProfieModal/ProfileModal"

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResut, setSearchResut] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const {user} = ChatState()


    return(
        <>
        <Box

            d="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >
            <Flex>
            <Tooltip 
                label="Search User to Chat"
                hasArrow
                placement="bottom-end"
            >
                <Button variant="ghost">
                    <i class="fas fa-search"></i>
                    <Text d={{base: "none", md: "flex"}} px="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>

            <Spacer/>

            <Text fontSize="2xl" fontFamily="Work sans">
                Talk-A-Tive
            </Text>

            <Spacer/>

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
                        <MenuItem>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
            </Flex>
        </Box>
        </>
    )
}
export default SideDrawer