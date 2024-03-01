// App.tsx
import React, { useEffect, useState } from 'react';
import {View, Button, Text, FlatList, TextInput, SafeAreaView} from 'react-native';
import io from 'socket.io-client';

const socket = io('http://45.90.217.142:3000');

const App: React.FC = () => {
    const [connected, setConnected] = useState(false)
    const [roomStatus, setRoomStatus] = useState('');
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        socket.on('connect', ()=> {
            console.log(connected);
            setConnected(true);
        });

        socket.on('connect_failed', (err)=> {
            alert(err);
            setConnected(false)
        })
        socket.on('connection_failed', (err)=> {
            alert(err);
            setConnected(false)
        })
        socket.emit('joinRoom', 1); // Join room number 1
        socket.on('roomStatus', (data) => {
            setRoomStatus(data.status);
        });
        socket.on('chatMessage', (messages) => {
            setChatMessages(messages)
        })
        socket.on('error',()=> {
            console.log('error')
        })
    }, []);

    const changeStatus = (status: string) => {
        socket.emit('changeStatus', 1, status, 5); // Change room status to the selected status
    };

    const sendMessage = () => {
        if(messageInput.trim()) {
            socket.emit('chatMessage', 1, messageInput);
            setMessageInput('');
        }
    }

    return (
        <SafeAreaView>
            <View style={{ height: '100%', marginTop: 100, justifyContent: 'center', alignItems: 'center', justifySelf: 'center' }}>
                <Text>connected: {connected}</Text>
                <Text>Room Status: {roomStatus}</Text>


                <TextInput value={messageInput} onChangeText={setMessageInput} placeholder={'xui'} />
                <Button title="send message" onPress={() => sendMessage()} />
                <Button title="Change Status to Waiting" onPress={() => changeStatus('waiting')} />
                <Button title="Change Status to Ready-to-Go" onPress={() => changeStatus('ready-to-go')} />
                <Button title="Change Status to Going" onPress={() => changeStatus('going')} />
                <FlatList
                    data={chatMessages}
                    renderItem={({item}) => {
                        return <Text>{item}</Text>
                    }} />
            </View>

        </SafeAreaView>
    );
};

export default App;