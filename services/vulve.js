const Model = require("./../models");
const vulve = Model.Vulve;

/********************   For Socket Request */
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
    return await vulve.findOneAndUpdate({s_device_id:deviceId},{is_online:false},{new:true});
}
const statusChange = async(changeData) => {
    const vulveName = changeData.vulveName;
    const data = {
        flowValue: changeData.flowValue
    }
    try{
        return await vulve.findOneAndUpdate({vulveName:vulveName},data,{new:true});
    } catch (err) {
        return err ;
    }
}

/********************* For Router Request ************************/

const getVulves = async(data) => {
    await vulve.updateMany({userId:data['_id']},{s_user_id:data['s_user_id']});
    return await vulve.find({userId:data['_id']});
}

const getVulve = async(vulveNameObj) => {
    return await vulve.find(vulveNameObj);
}

const saveVulve = async(vulveDTO) => {
    const vulveName = vulveDTO.vulveName;
    const device = await vulve.find({vulveName: vulveName});
    if ( device.length > 0 ){
        try{
            const updateVulve =  await vulve.findOneAndUpdate({vulveName: vulveName},vulveDTO,{new:true});
            return updateVulve ;
        } catch(err) {
            return err ;
        }
    } else {
        const saveData = {
            ...vulveDTO,
            is_online: false
        }
        const newVulve = await new vulve(saveData);
        try{
            return newVulve.save();
        } catch(err){
            return err;
        }
    }
}

module.exports = {
    check_register,
    disConnect,
    statusChange,
    getVulves,
    getVulve,
    saveVulve
}