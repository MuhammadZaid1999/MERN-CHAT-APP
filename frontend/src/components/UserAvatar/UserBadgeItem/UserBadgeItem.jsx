import { CloseIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"

const UserBagdeItem = ({user, handleFunction}) => {

    return(
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="soid"
            fontSize={12}
            bgColor="purple"
            color="white"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon pl={1}/>
        </Box>
    )

}

export default UserBagdeItem