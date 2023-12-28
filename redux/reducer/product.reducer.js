import {createSlice} from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState:{
        cart:{},
        quanityCart:0,
        datasearch:'',
        quantityFavorite:0
    },
    reducers:{
        updateQuanityProduct: (state,action) =>{
            state.quanityCart = action.payload;
        },
        updateCart :(state,action) =>{
            state.cart = action.payload;
        },
        updateDataSearch :(state,action)=>{
            state.datasearch = action.payload;
        },
        updatequantityFavorite :(state,action)=>{
            state.quantityFavorite = action.payload;
        }
    }
})

export const {updateQuanityProduct,updateCart,updateDataSearch,updatequantityFavorite} = productSlice.actions;

export default productSlice.reducer;