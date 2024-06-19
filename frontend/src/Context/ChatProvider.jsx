import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setUser] = useState()
    const [seletedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])


    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)

        if(!userInfo){
            navigate("/")
        }
    }, [navigate])

    return(
        <ChatContext.Provider 
            value={{user, setUser, seletedChat, setSelectedChat, chats, setChats}}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => (
    useContext(ChatContext)
)

export default ChatProvider