import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search, setSearch] = useState("");
    const [SearchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast=useToast();

    const {user,chats,setChats}=ChatState();

    const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
        title: "Please fill all the fields",
        // description: "Failed to Load the Search Results",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });return;
        }

        try {
            const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const data=await axios.post("/api/chat/group",{
          name:groupChatName,
          users:JSON.stringify(selectedUsers.map((u)=>u._id)),
      },config);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created",
        // description: "Failed to Load the Search Results",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
        } catch (error) {
            toast({
        title: "Failed to create the chat",
        description: error.reponse.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
        }


    };

    const handleDelete=(deletedUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id!==deletedUser._id));

    };

      const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
    


  return (
     <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work Sans" display="flex" justifyContent="center ">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
              <FormControl>
                  <Input placeholder="Group Name" mb={3} onChange={(e)=> setGroupChatName(e.target.value)} />
              </FormControl>
              <FormControl>
                  <Input placeholder="Add Users" mb={1} onChange={(e)=> handleSearch(e.target.value)} />
              </FormControl><Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map(user=>(
                  <UserBadgeItem key={user.name} user={user} handleFunction={()=>handleDelete(user)} />
              ))}</Box>

              {loading ? (
              
              <div>Loading...</div>
            ) : (
              SearchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  /> ))
            )}
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal