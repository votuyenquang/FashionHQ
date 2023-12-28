
// import {API_URL} from "@env"

const API_URL = 'http://192.85.4.132:3005'
// const API_URL = 'http://192.168.1.12:3005'


export const SetHTTP = (urlImage)=>{
    if(urlImage.includes('http')){
        // console.log('SetHTTP :', API_URL+urlImage)
        return urlImage
    }else{      
        return API_URL+urlImage
    }

}

