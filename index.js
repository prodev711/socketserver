if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const service = require('./services');

const loginRouter = require('./routes/login');
const vulveRouter = require('./routes/vulve');

/************************************** MongoDB Connection **********************************/
const mongoose = require('mongoose');

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
/**********************************SIMPLE     API      ROUTE************************************* */
app.get("/api",(req,res) => {
    res.json(chatRooms);
});

app.delete('/vulves/:vulveName',async(req,response) => {
    const vulveName = req.params.vulveName ;
    try{
        const result = await service.vulveService.deleteVulve(vulveName);
        if ( result != null ){
            socketIO.to(result.s_device_id).emit('value',0);
            response.json({result : true});
        } else {
            response.status(400).json({
                message:"Error: there are some problem at server side"
            })
        }
    } catch(error) {
        response.status(400).json({
            message:"Error: there are some problem at server side"
        })
    }
})

app.put('/vulves/:userId',async(req,response) => {
    const userId = req.params.userId ;
    try{
        const result = await service.vulveService.formatOpenVulve(userId);
        for ( var i = 0 ; i < result.length ; i ++ ){
            if ( result[i].s_device_id == undefined ) continue ;
            socketIO.to(result[i].s_device_id).emit('value',0);
        }
        response.json({message:"true"});
    } catch(error) {
        response.status(400).json({
            message:"Error: there are some problem at server side"
        })
    }
})

app.use("/",loginRouter);
app.use("/",vulveRouter);
/**************************************   END         ********************************* */


/*********************************     Socket Phase ***************************/

const socketIO =  require('socket.io')(http,{
    cors:{origin:"*"}
});

socketIO.on('connection', async (socket) => {
    const remoteAddress = socket.request.connection.remoteAddress;
    console.log(`Incoming connection from ${socket.id}`);
    // Send to the connected user
    socketIO.to(socket.id).emit('connected', "0");
    socket.on('register',async (vulveName) => {
        const remoteAddress = socket.request.connection.remoteAddress;
        console.log(remoteAddress);
        const data = {
            vulveName: vulveName,
            vulveIp: remoteAddress,
            s_device_id : socket.id,
            is_online : true
        };
        const result = await service.vulveService.check_register(data);
        if ( result?.s_user_id ){
            socketIO.to(result.s_user_id).emit("connected_device",result);
        }
    })
    socket.on('disconnect', async () => {
        const result = await service.vulveService.disConnect(socket.id) ;
        if (result?.s_user_id != undefined){
            socketIO.to(result.s_user_id).emit("disconnected_device",result);
        } else {
            const reverse = await service.vulveService.disConnectApp(socket.id);
            for ( var i = 0 ; i < reverse.length ; i ++ ){
                socketIO.to(reverse[i].s_device_id).emit('value',0);
            }
        }
        console.log(`Client disconnected: ${socket.id}`);
    });
    socket.on('changeFlow_from_front',async(payload) => {
        const result = await service.vulveService.statusChange(payload);        
        if (result.vulveName == undefined){
            socketIO.to(socket.id).emit("change_flow_error", "not updated");
        } else {
            socketIO.to(result['s_device_id']).emit("value",result['flowValue']);
        }
    });
    
});
/***************************        End Socket Phase **********************************/

module.exports = {socketIO};

http.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT}`);
})
