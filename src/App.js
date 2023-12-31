import { Box, Button, Container, VStack , HStack} from "@chakra-ui/react";
import { app } from "./Firebase";
import { useEffect, useRef, useState } from "react";
import Message from "./Components/Message";
import {onAuthStateChanged, getAuth,GoogleAuthProvider,signInWithPopup , signOut} from "firebase/auth"
import {getFirestore,query, orderBy, addDoc, collection, serverTimestamp, onSnapshot} from "firebase/firestore"




const auth = getAuth(app)
const db = getFirestore(app);

const LoginHandler = () => {
  const Provider = new GoogleAuthProvider(); 
  signInWithPopup(auth,Provider)
}
const LogoutHandler = () => signOut(auth);

function App() {
  const [user, setuser] = useState(false)
  const [message, setmessage] = useState(" ")
  const [messages, setmessages] = useState([])
  const divforscroll = useRef(null);

  
  const SubmitHandler = async(e) => {
    e.preventDefault()
  
    try {
      setmessage(""); 
      await addDoc(collection(db, "Messages"), {
        text:message, 
        uid:user.uid,
        uri:user.photoURL,
        createdAt :serverTimestamp(),
      })
      divforscroll.current.scrollIntoView({behavior : "smooth"});
    } catch (error) {
     alert(error)
    }
    }

  useEffect(() => {
  const q = query(collection( db ,"Messages"), orderBy("createdAt", "asc"));
    const sub = onAuthStateChanged(auth,(data) => {
    setuser(data)
  })

     const subForMessages = onSnapshot(q,(snap) => {
    setmessages(snap.docs.map((item)=> {
      const id = item.id
      return { id, ...item.data()};
    }))
  })

  return () => {
    sub();
    subForMessages();
  }

  }, [])



  return (
    <Box bg={"red.50"}>
    {
      user ? (
        <Container h={"100vh"} bg={"white"}>
        <VStack h={"full"}  paddingY={"3"} >
          
         <Button onClick={LogoutHandler} colorScheme={"red"} w={"full"}>
           Logout
         </Button>
 
 <VStack  overflowY={"auto"} h={"full"} w={"full"}   css={{"&::-webkit-scrollbar":
         {
          display: "none",
        },}}>


  {
    messages.map((item)=> (
 <Message
 key={item.id}
 user={item.uid === user.uid ? "me" : "other"} 
   text={item.text}
    uri={item.uri} />
    ))
  }
 <div ref={divforscroll}></div>
 </VStack>

 <form onSubmit={SubmitHandler} style={{width:"100%" }}>
   <HStack>
   <input value={message}  onChange={(e)=>setmessage(e.target.value)} placeholder="Enter a message..." style={{border:"1px solid #d1c0c0" , width:"100%" , height:"43px"}}/>
   <Button fontSize={"10px"}  colorScheme={"purple"} type="submit"> Send </Button>
   </HStack>
 </form>
 
        </VStack>
       </Container>
      ) : <VStack h={"100vh"} bg={"white"} justifyContent={"center"}>
        <h1 style={{ fontSize:"24px"}}>Login with Google</h1>
        <Button onClick={LoginHandler} colorScheme="purple">Sign in with Google</Button>
      </VStack>
    }
    </Box> 
  );
}

export default App;
