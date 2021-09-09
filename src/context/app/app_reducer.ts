import { AppActions, State } from "../../interfaces/interfaces"

function appReducer(state:State,action:AppActions){
    const {payload,type} = action

    switch (type) {
        case 'swich_menu':
            return{
                ...state,
                menu_state:payload
            }
        case 'get_posts':
            return{
                ...state,
                posts_state:payload
            }
        case 'get_post':
            return{
                ...state,
                post_state:payload
            }
        case 'get_paginas':
            return{
                ...state,
                paginas_state:payload
            }
        case 'get_accesorios':
            return{
                ...state,
                accesorios_state:payload
            }
        case 'get_tipos':
            return{
                ...state,
                tipos_state:payload
            }
        case 'get_categorias':
            return{
                ...state,
                categorias_state:payload
            }
        case 'get_metas':
            return{
                ...state,
                metas_state:payload
            }
        default:
            return state;
    }
}
export default appReducer