import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate()


    const handleClick = () => {
        setShow(!show)
    } 

    const submitHandler = async () => {
        setLoading(true)
        if(!email || !password){
            toast({
                title: "Please fill all the Fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
            return
        }

        try{
            const config = {
                header: {
                    "Content-type": "application/json"
                }
            }

            const {data} = await axios.post("http://localhost:5000/api/user/login",
                {email, password},
                config
            )
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate("/chats")
        }
        catch(error){
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <VStack spacing={2}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your Password"
                        value={password}
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
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                variant="solid"
                colorScheme="red"
                w="100%"
                onClick={() => {
                    setEmail("test1@gmail.com")
                    setPassword("test123")
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login