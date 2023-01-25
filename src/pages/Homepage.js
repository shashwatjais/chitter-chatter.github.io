import React, { useEffect } from 'react'
import {Container,Box,Text,Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react' 
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom';

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW='xl' centerContent>
      <Box
      d='flex'
      justifyContent="center"
      textAlign='center'
      p={3}
      bg={"whiteAlpha.600"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px">
        <Text fontSize='4xl' fontFamily='Work Sans' color="black">Chitter-Chatter</Text>
      </Box>
      <Box bg="whiteAlpha.600" w="100%" p={4} borderRadius="lg" color='black' borderWidth="1px" >
        <Tabs variant='soft-rounded' >
  <TabList mb='1em'>
    <Tab w="50%">Login</Tab>
    <Tab w="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  );
};
export default Homepage