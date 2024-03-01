// App.tsx
import React, { useEffect, useState } from 'react';
import {View, FlatList, SafeAreaView, ScrollView} from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import io from 'socket.io-client';

const socket = io('http://45.90.217.142');

const App: React.FC = () => {
    const [connected, setConnected] = useState(false)
    const [roomStatus, setRoomStatus] = useState('');
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        socket.on('connect', ()=> {
            console.log('connected: ', connected);
            setConnected(true);
        });

        socket.on('connect_failed', (err: any)=> {
            setConnected(false)
        })
        socket.on('connection_failed', (err: any)=> {
            setConnected(false)
        })
        socket.emit('joinRoom', 1); // Join room number 1
        socket.on('roomStatus', (data: {status: string}) => {
            setRoomStatus(data.status);
        });
        socket.on('chatMessage', (messages: string[]) => {
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


                <Button onPress={() => changeStatus('waiting')}>Change Status to Waiting</Button>
                <Button onPress={() => changeStatus('ready-to-go')}>Change Status to Ready-to-Go</Button>
                <Button onPress={() => changeStatus('going')}>Change Status to Going</Button>
                <TextInput right={(<TextInput.Icon onPress={() => sendMessage()} size={20} iconColor='black' icon={'send'} />)} mode='flat' style={{width: '100%', position: 'absolute', bottom: 230}} placeholderTextColor={'grey'} value={messageInput} onChangeText={setMessageInput} placeholder={'xui'} />
                <ScrollView>
                <FlatList
                    data={chatMessages}
                    renderItem={({item}) => {
                        return <Text>{item}</Text>
                    }} />
                </ScrollView>
            </View>

        </SafeAreaView>
    );
};

export default App;