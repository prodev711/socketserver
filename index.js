if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const mongoose = require('mongoose');
const Router = require("./routes/login");
const userModel = require('./models/User');

/************************************** MongoDB Connection **********************************/
mongoose.connect(`mongodb+srv://${process.env.mongousername}:${process.env.password}@${process.env.cluster}.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`,{});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error : "));
db.once("open",function(){
    console.log("Connected successfully !!!");
});

/*********************************    End MongoDB connection     *************************/

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const http = require("http").createServer(app);
const cors = require('cors');

app.use(cors({origin:"*"}));

const generateID = () => Math.random().toString(36).substring(2,10);

let chatRooms = [
    {
     id: generateID(),
     name: "Novu Hangouts",
     messages: [
         {
             id: generateID(),
             text: "Hello guys, welcome!",
             time: "07:50",
             user: "Tomer",
         },
         {
             id: generateID(),
             text: "Hi Tomer, thank you! 😇",
             time: "08:50",
             user: "David",
         },
     ],
    }
];

/**********************************SIMPLE     API      ROUTE************************************* */
app.get("/api",(req,res) => {
    res.json(chatRooms);
});
app.post("/login",(req,res) => {
    const {username, password} = req.body ;
    console.log(userModel);
    return ;
    try{
        const userRow = userModel.findOne({email: username, password: password }).exec(async data => {
            res.json(await data);
        })
    } catch (error) {
        res.status(500).send(error);
    }
    
});
app.post("/signup", async(req,response) => {
    console.log(req.body);
    const {username, email, password} = req.body ;
    try {
        const userRow = userModel.find({email: email},async(err,res)=>{
            console.log("find");
            if ( err ){
                response.json({status:"fail"});
            }
            response.json({status:"exist"});
        })
    } catch(e) {
        console.log("not find");
        const txt = e.message ;
        console.log(txt);
        if ( txt.search("no longer accepts a callback") >= 0 ){
            const user = new userModel(req.body);
            user.save().then( (data) => {
                response.json({status:"success", id: data.id})
            }).catch((e) => {
                response.json({status:"fail"});
            })
        }        
    }
})
/**************************************   END         ********************************* */


/*********************************     Socket Phase ***************************/

const socketIO =  require('socket.io')(http,{
    cors:{origin:"*"}
});

socketIO.on('connection', function (socket) {
    const remoteAddress = socket.request.connection.remoteAddress;
    console.log(`Incoming connection from ${remoteAddress}`);
    // Send to the connected user
    socket.emit('value', "0");
    for (var i=0;i<5;i++){
        socket.emit('value', `${i}`);
    }
    for (var i=5;i>0;i--)
    {
        socket.emit('value', `${i}`);
    }
    socket.on('register',function (data) {
        console.log(data);
    })
    // On each "status", run this function
    socket.on('status', function (data) {
        console.log(data);
    });
    socket.on('disconnect', function () {
        console.log("disconnected");
    });
    socket.on('test', function (data) {
        console.log(data);
    });
    socket.on('normal',function (data){
        console.log(`this is ${data}`)
    })
});
/***************************        End Socket Phase **********************************/


http.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT}`);
})