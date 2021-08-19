import React, {useEffect, useState} from 'react';
import './App.scss';
import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/Chat/Chat";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        axios.get("/messages/sync").then((response: { data: any; }) =>{
            setMessages(response.data)
        })
    }, [])

    useEffect(() => {

        const pusher = new Pusher('080fa52bd0c35c3b3566', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('inserted', (newMessages: any) => {
            // @ts-ignore
            setMessages([...messages, newMessages])
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages]);

    console.log(messages)

    return (
        <div className="app">
            <div className="app__body">
                <Sidebar/>
                <Chat  messages={messages}/>
            </div>
        </div>
    );
}

export default App;
