export const Check = (arr,value)=>{
        if(arr != null){
            for(const item of arr){
                if(item.id === value){
                    return true;
                }
            }
            return false
        }else{
            return 0;
        }
    }
