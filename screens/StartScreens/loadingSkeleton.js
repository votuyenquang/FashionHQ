import React from "react";
import { Dimensions} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


export const LoadingSkeletonCategory = ()=>{
 return (
    <SkeletonPlaceholder backgroundColor='#E7EAED' flex={1}>
      <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-around'  
                                    height={windownH*0.18} marginTop={2}>
            <SkeletonPlaceholder.Item justifyContent='center' alignItems='center'>
                <SkeletonPlaceholder.Item  height={60} width={60} borderRadius={50}/>
                <SkeletonPlaceholder.Item height={20} width={windownW*0.2} borderRadius={30} marginTop={10}/>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item justifyContent='center' alignItems='center'>
                <SkeletonPlaceholder.Item  height={60} width={60} borderRadius={50}/>
                <SkeletonPlaceholder.Item height={20} width={windownW*0.2} borderRadius={30} marginTop={10}/>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item justifyContent='center' alignItems='center'>
                <SkeletonPlaceholder.Item  height={60} width={60} borderRadius={50}/>
                <SkeletonPlaceholder.Item height={20} width={windownW*0.2} borderRadius={30} marginTop={10}/>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item justifyContent='center' alignItems='center'>
                <SkeletonPlaceholder.Item  height={60} width={60} borderRadius={50}/>
                <SkeletonPlaceholder.Item height={20} width={windownW*0.2} borderRadius={10} marginTop={10}/>
            </SkeletonPlaceholder.Item>
 
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>

 )
}


export const LoadingSkeletonSieuSale = ()=>{
    return (
       <SkeletonPlaceholder  backgroundColor='#E7EAED' flex={1}>
         <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-around'
                                       height={windownH*0.35} marginTop={4}>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.17} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.17} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.17} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>
   
    )
   }


export const LoadingSkeletonflashsale = ()=>{
    return (
       <SkeletonPlaceholder  backgroundColor='#E7EAED' flex={1}>
         <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-around'
                                       height={windownH*0.35} marginTop={10}>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.27} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.19} borderRadius={10} marginTop={8}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.27} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.19} borderRadius={10} marginTop={8}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
               <SkeletonPlaceholder.Item >
                   <SkeletonPlaceholder.Item  height={windownH*0.2} width={windownW*0.3} borderRadius={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.27} borderRadius={10} marginTop={10}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.19} borderRadius={10} marginTop={8}/>
                   <SkeletonPlaceholder.Item height={20} width={windownW*0.25} borderRadius={10} marginTop={8}/>
               </SkeletonPlaceholder.Item>
               
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>
   
    )
   }

   export const LoadingSkeletonSliderbox= ()=>{
    return (
       <SkeletonPlaceholder  backgroundColor='#E7EAED' flex={1}>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-between' marginHorizontal={10} >
                <SkeletonPlaceholder.Item  height={windownH*0.37} width={windownW*0.44} borderRadius={20}/>

                <SkeletonPlaceholder.Item  flexDirection="column" justifyContent='space-around'>
                     <SkeletonPlaceholder.Item  flexDirection="row" justifyContent='space-between'>
                            <SkeletonPlaceholder.Item  height={65} width={windownW*0.18} borderRadius={10}/>
                            <SkeletonPlaceholder.Item   flexDirection="column" justifyContent='space-around' marginLeft={10}>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.29} borderRadius={10}/>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.19} borderRadius={10}/>
                            </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item  flexDirection="row" justifyContent='space-between'>
                            <SkeletonPlaceholder.Item  height={65} width={windownW*0.18} borderRadius={10}/>
                            <SkeletonPlaceholder.Item   flexDirection="column" justifyContent='space-around' marginLeft={10}>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.29} borderRadius={10}/>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.19} borderRadius={10}/>
                            </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item  flexDirection="row" justifyContent='space-between'>
                            <SkeletonPlaceholder.Item  height={65} width={windownW*0.18} borderRadius={10}/>
                            <SkeletonPlaceholder.Item   flexDirection="column" justifyContent='space-around' marginLeft={10}>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.29} borderRadius={10}/>
                                <SkeletonPlaceholder.Item  height={20} width={windownW*0.19} borderRadius={10}/>
                            </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              
            </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>
   
    )
   }






const windownW = Dimensions.get('window').width;
const windownH = Dimensions.get('window').height;