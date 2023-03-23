const mongoose  = require("mongoose");

const VulveSchema = new mongoose.Schema({
    userId : {
        type: String,
    },
    vulveName : {
        type: String,
        require : true
    },
    vulveIp : {
        type : String,
    },
    type : {
        type: Number,
    },
    flowValue : {
        type : Number,
        default : 0
    },
    s_device_id : {
        type: String,
    },
    is_online : {
        type: Boolean,
        require : true
    },
    s_user_id:{
        type:String
    }
})

const Vulve = mongoose.model("Vulve" , VulveSchema);

module.exports = Vulve ;