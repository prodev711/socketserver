const Model = require("./../models");
const vulve = Model.Vulve;

const check_register = async(deviceDTO) => {
    const vulveName = deviceDTO.vulveName;
    const device = await vulve.find({vulveName: vulveName});
    if ( device.length > 0 ){
        try{
            const result =  await vulve.findOneAndUpdate({vulveName: vulveName},deviceDTO,{new:true});
            return result ;
        } catch(err) {
            return err ;
        }
    } else {
        const newDevice = await new vulve(deviceDTO);
        try{
            return newDevice.save();
        } catch(err){
            return err;
        }
    }
}

const disConnect = async(deviceId) => {
    const result = await vulve.findOneAndUpdate({s_device_id:deviceId},{is_online:false},{new:true});
    return result ;
}

module.exports = {
    check_register,
    disConnect
}