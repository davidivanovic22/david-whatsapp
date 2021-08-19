import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMesages.js";
import Pusher from "pusher";
import cors from "cors";
// b3VVOBdvAJ3CG7aP
// importing

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1250557",
    key: "080fa52bd0c35c3b3566",
    secret: "ee53aba288e867673bde",
    cluster: "eu",
    useTLS: true
});
//middleware
app.use(express.json())
app.use(cors())


//DB config
const connection_url = "mongodb+srv://admin:b3VVOBdvAJ3CG7aP@cluster0.mhyhb.mongodb.net/whatsapp-mern-backend?retryWrites=true&w=majority"

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.once("open", () => {
    console.log("DB connected")
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted",
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received,
                });
        }else{
            console.log("Error triggering Pusher")
        }
    })
})

//?????

// api routes

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`new message created: \n ${data}`)
        }
    })
})
//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`))
