import React, {useState} from 'react';
import "./Chat.scss"
import {Avatar, IconButton} from "@material-ui/core";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./../../axios"
// @ts-ignore
const Chat = ({messages}) => {
    const [input, setInput] = useState("");
    const sendMessage = async (e: any) => {
        e.preventDefault();
        axios.post("/messages/new", {
            "message": input,
            "name": "Djoka",
            "timestamp": "Just now",
            "received": true
        }).then(r => r)

        setInput("");
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar/>
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map((message: any) => (
                    <p
                        key={message._id}
                        className={`chat__message ${message.received && "chat__receiver"}`}>
                        <span className="chat__name">{message?.name}</span>
                        {message?.message}
                        {message?.received}
                        <span className="chat__timestamp">{message?.timestamp}</span>
                    </p>
                ))}
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon/>
                <form>
                    <input value={input}
                           onChange={e => setInput(e.target.value)}
                           placeholder="Type a message"
                           type="text"
                    />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    );
};


export default Chat;
