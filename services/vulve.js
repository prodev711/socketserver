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
const disConnectApp = async(appId) => {
    await vulve.updateMany({s_user_id:appId,is_online:true},{flowValue:0});
    return await vulve.find({s_user_id:appId,is_online:true});
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
            if ( device[0].userId == undefined || device[0].userId == "" ){
                const updateVulve =  await vulve.findOneAndUpdate({vulveName: vulveName},vulveDTO,{new:true});
                return updateVulve ;
            } else {
                return {'result':'existdevice'} ;
            }
        } catch(err) {
            return err ;
        }
    }
    return {
        'result' : 'nodevice' 
    };
}

const deleteVulve = async(vulveName) => {
    return await vulve.findOneAndUpdate({vulveName: vulveName},{s_user_id:'',userId:''},{new:true});
}

const formatOpenVulve = async(userId) => {
    const res = await vulve.updateMany({userId:userId},{flowValue:0});
    const result = await vulve.find({userId:userId});
    return result ;
}

module.exports = {
    check_register,
    disConnect,
    disConnectApp,
    statusChange,
    getVulves,
    getVulve,
    saveVulve,
    deleteVulve,
    formatOpenVulve
}