
export default function truncate(string){
    if(string.length>25){
        return string.substring(0, 30) +"...";
    }else{
        return string;
    }
}