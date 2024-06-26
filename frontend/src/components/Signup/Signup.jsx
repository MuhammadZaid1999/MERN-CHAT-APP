import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pic, setPic] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate()

    const handleClick = () => {
        setShow(!show)
    } 

    const postDetails = (pics) => {
        setLoading(true)
        if(pics === undefined){
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
            return
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "mern-chat-app")
            data.append("cloud_name", "dx9mfiu5j")

            fetch("https://api.cloudinary.com/v1_1/dx9mfiu5j/image/upload",{
                method: "post",
                body: data
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString())
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
        }

        else{
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
            return
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
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

        if(password !== confirmPassword){
            toast({
                title: "Password do not Match!",
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

            const {data} = await axios.post("http://localhost:5000/api/user/register",
                {name, email, password, pic},
                config
            )
            toast({
                title: "Registration Successful",
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
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
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
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    accept="image/*"
                    p={1.5}
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                w="100%"
                mt={15}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup