import React, { useContext } from 'react'
import { create_categoria } from '../api/get_categorias_controllers'
import { get_categorias } from '../api/get_categorias_controllers'
import GlobalAppContext from '../context/app/app_state'

export const NewCategoria=()=>{
    const {app_dispatch} = useContext(GlobalAppContext)
    const prepare_posts=async()=>{
        const categorias = await get_categorias({})
        app_dispatch(
            {
                type:'get_categorias',
                payload:categorias
            }
        )
    }
    const create_category_handler=async(e:any)=>{
        e.preventDefault()
        const {categoria} = e.target
        if(categoria && categoria.value !==''){
            await create_categoria({titulo:categoria.value})
            await prepare_posts()
        }
        return
    }
    return(
        <div>
            <form onSubmit={create_category_handler} className="new_categoria">
                <div>
                    <label>Titulo</label>
                    <input type="text" name="categoria" required/>
                </div>
                <div>
                    <button>Crear</button>
                    <span>cerrar</span>
                </div>
            </form>
            <style>
                {
                    `
                    .new_categoria{
                        position:relative;
                        margin:10px 0;
                    }
                    .new_categoria input{
                        width:100%;
                    }
                    `
                }
            </style>
        </div>
    )
}