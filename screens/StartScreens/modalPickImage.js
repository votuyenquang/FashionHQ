import React from 'react';
import {Modal,View,Text,StyleSheet,TouchableOpacity,ToastAndroid} from 'react-native'
import {handleChoosePhotoCamera,handleChoosePhotoLibrary} from '../../util/adapterPickImage';
// import {API_URL} from "@env";
// const API_URL = "";
const API_URL = 'http://192.85.4.132:3005'
// const API_URL = 'http://192.168.1.12:3005'





import * as GETAPI from '../../util/fetchApi';
export default function ModalPickImage(props){
    let code = "";
    const handleChooseImage = async()=>{
        let img;
        if(code==="CAMERA"){
            img = await handleChoosePhotoCamera()
            handleUploadImage(img)
        }else if(code==="LIBRARY"){
            img = await handleChoosePhotoLibrary()
            handleUploadImage(img)
        }
        
    }
    const handleUploadImage = (dataI)=>{
        const formData = new FormData();
        console.log(Platform.OS);
        let link = API_URL+"/uploads/uploadImageAvatar"
        formData.append('image', { uri: Platform.OS === 'ios' ? dataI.uri.replace('file://', '') : dataI.uri, name: dataI.fileName, type: dataI.type });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', link); // the address really doesnt matter the error occures before the network request is even made.
        xhr.send(formData);
        xhr.onreadystatechange = e => {
            if (xhr.readyState !== 4) {
            return;
            }
            if (xhr.status === 200) {
                console.log(xhr.responseText)
                const res = JSON.parse(xhr.responseText);
                if(res.msg){
                    console.log("Upload success !")
                    console.log("result is :" +JSON.stringify(res.msg))
                    handleUpdateAvatar(res.msg.filename)
                }else{
                    console.log("Upload failed !")
                    return false;
                }
            } else {
                console.log('error', xhr.responseText);
            }
        };
    }
    const handleUpdateAvatar = async(linkImg)=>{
        const img = "/Upload/ImageAvatar/"+linkImg;
        const data = {
            "IDUSER":props.idUser,
            "URLIMAGE":img,
        }   
        const res = await GETAPI.postDataAPI("/user/updateAvatarUser",data);
        if(res.msg=="Success"){
            console.log("Update sucess")
            ToastAndroid.show("Updated profile picture successfully !", ToastAndroid.SHORT);
            props.onClose()
            props.refresh()
        }else{
           
        }
    }
    return(
    <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
    >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <View style={{ alignItems:'center' }}>
                <Text style={{ fontWeight: 'bold',fontSize: 16}}>
                    {props.status_avatar===null ?"Select photo as avatar":"Update Avatar"}
                </Text>
                <TouchableOpacity style={styles.item_choose_image} onPress={()=>{code="CAMERA";handleChooseImage()}}>
                    <Text>Select photo from Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.item_choose_image} onPress={()=>{code="LIBRARY";handleChooseImage()}}>
                    <Text>Select photo from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onClose} style={styles.btn_cacel_pick_img}>
                    <Text style={{ color:'white' }}>Later</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </Modal>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        
    },
    modalView: {
        margin: 20,
        // backgroundColor: "transparent",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        justifyContent:"center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    item_choose_image:{
        borderBottomWidth:.2,
        borderColor:'gray',
        paddingTop:20,
        display:'flex',
        alignItems: 'center', 
        paddingBottom:5
    },
    btn_cacel_pick_img:{
        width:100,
        padding:10,
        backgroundColor:'tomato',
        borderRadius:20,
        marginTop:20,
        alignItems:'center', 
        elevation:5
    }
})