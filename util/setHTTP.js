import API_URL from '../api_url';




export const SetHTTP = (urlImage)=>{
    if(urlImage.includes('http')){
        return urlImage
    }else{      
        return API_URL+urlImage
    }

}

