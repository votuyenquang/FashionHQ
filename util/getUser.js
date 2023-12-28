import * as FetchAPI from './fetchApi';
import {updateUser} from '../redux/reducer/user.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getUser = async(token,dispatch)=>{
    const data = {"token":token};
    const res = await FetchAPI.postDataAPI("/user/getUser",data);
    if(res.msg){
        if(res.msg.message ==="jwt expired"){
            await AsyncStorage.removeItem("@token");
            return false;
        }
    }else{
        if(res[0].status===1){
            await AsyncStorage.removeItem("@token");
            return "block";
        }else{
            dispatch(updateUser(res[0]));
            // console.log(res[0])
            return true  
        }
       
    }
    
}