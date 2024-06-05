import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react"
import { useState } from "react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)

    const handleClick = () => {
        setShow(!show)
    } 

    const submitHandler = () => {}

    return(
        <VStack spacing={2}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
        
            <Button
                colorScheme="blue"
                w="100%"
                mt={15}
                onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                variant="solid"
                colorScheme="red"
                w="100%"
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login