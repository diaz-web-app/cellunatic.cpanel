import React, { useContext } from 'react'
import { create_tipo_post } from '../api/create_tipos_post_controllers'
import { get_tipos_post } from '../api/get_tipos_post_controllers'
import GlobalAppContext from '../context/app/app_state'

export const NewPostType=()=>{
    const {app_dispatch} = useContext(GlobalAppContext)
    const prepare_posts=async()=>{
        const tipos_post = await get_tipos_post({})
        app_dispatch(
            {
                type:'get_tipos',
                payload:tipos_post
            }
        )
    }
    const create_post_handler=async(e:any)=>{
        e.preventDefault()
        const {tipo_post} = e.target
        if(tipo_post && tipo_post.value !==''){
            await create_tipo_post({titulo:tipo_post.value})
            await prepare_posts()
        }
        return
    }
    return(
        <div>
            <form onSubmit={create_post_handler} className="new_post_type">
                <div>
                    <label>Titulo</label>
                    <input type="text" name="tipo_post" required/>
                </div>
                <div>
                    <button>Crear</button>
                    <span>cerrar</span>
                </div>
            </form>
            <style>
                {
                    `
                    .new_post_type{
                        position:relative;
                        margin:10px 0;
                    }
                    .new_post_type input{
                        width:100%;
                    }
                    `
                }
            </style>
        </div>
    )
}