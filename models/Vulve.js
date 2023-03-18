import mongoose from "mongoose";

const VulveSchema = new mongoose.Schema({
    userId : {
        type: String,
        require: true
    },
    vulveName : {
        type: String,
        require : true
    },
    vulveIp : {
        type : String,
    },
    type : {
        type: String,
        require : true
    }
},{
    collation:"vulves",
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Vulve = mongoose.model("Vulve" , VulveSchema);

module.exports = Vulve ;