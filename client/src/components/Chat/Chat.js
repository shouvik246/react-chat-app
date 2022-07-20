import React , {useEffect, useState} from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import './Chat.css';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = () => {  // location is a prop from react-router
  const location = useLocation();
  const ENDPOINT = 'localhost:5000';
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const {name, room} = queryString.parse(location.search);
    socket = io(ENDPOINT)
    setName(name);
    setRoom(room);
    
    socket.emit('join',{name, room},(error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search])
  
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });

    socket.on('roomData',({users}) => {
      setUsers(users);
    })

  },[messages])

  const sendMessage = (event) => {
    event.preventDefault();
    if(message){
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room ={ room }/>
        <Messages 
          messages={messages}
          name= {name}
        />
        <Input 
          message = { message }
          setMessage = { setMessage }
          sendMessage = { sendMessage }
        />
        {/* <input 
          value={message} 
          onChange={(e) => {setMessage(e.target.value)}}
          onKeyPress={e => e.key === 'Enter' ? sendMessage(e): null}
        /> */}
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat