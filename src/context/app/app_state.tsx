import {createContext, Dispatch, useEffect, useReducer} from 'react'
import { get_categorias } from '../../api/get_categorias_controllers'
import { get_post_metas } from '../../api/get_post_metas_controllers'
import { get_tipos_post } from '../../api/get_tipos_post_controllers'
import { AppActions, State } from '../../interfaces/interfaces'
import appReducer from './app_reducer'

export const initialApp:State={
    paginas_state:null,
    posts_state:null,
    post_state:{metas:[],post:null,covers:[]},
    accesorios_state:null,
    menu_state:false,
    tipos_state:null,
    categorias_state:null,
    metas_state:null
}

const GlobalAppContext = createContext<{app:State;app_dispatch:Dispatch<AppActions>}>({app:initialApp,app_dispatch:()=>{}})

export const AppProvider =({children}:any)=>{
    const [app,app_dispatch] = useReducer(appReducer,initialApp)

    const prepare_cpanel=async()=>{
        const res_cats = await get_categorias({})
        const res_tipos = await get_tipos_post({})
        const res_metas = await get_post_metas({})
        app_dispatch({
            type:'get_tipos',
            payload:res_tipos
        })
        app_dispatch({
            type:'get_categorias',
            payload:res_cats
        })
        app_dispatch({
            type:'get_metas',
            payload:res_metas
        })
    }
    
    useEffect(()=>{
        prepare_cpanel()
    },[])
  return <GlobalAppContext.Provider value={{
      app,app_dispatch
  }} >
      {children}
  </GlobalAppContext.Provider>
}

export default GlobalAppContext