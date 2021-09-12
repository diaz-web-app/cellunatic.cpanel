import React, { useContext, useState } from 'react'
import { create_tipo_post } from '../api/create_tipos_post_controllers'
import { get_tipos_post } from '../api/get_tipos_post_controllers'
import GlobalAppContext from '../context/app/app_state'

type Props={
    titulo:string
    btn_text:string
}
export const NewPostType=({titulo,btn_text}:Props)=>{
    const {app_dispatch} = useContext(GlobalAppContext)
    const [show,setShow] = useState<boolean>(false)
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
            <div className="bar" >
                <b>{titulo}</b>
                <button onClick={()=>setShow(!show)} >{show?'close':btn_text}</button>
            </div>
            <form onSubmit={create_post_handler} className="new_post_type">
                <div>
                    <label>Titulo</label>
                    <input type="text" name="tipo_post" required/>
                </div>
                <div>
                    <button>Crear</button>
                </div>
            </form>
            <style>
                {
                    `
                    .new_post_type{
                        display:${show?'block':'none'};
                        position:relative;
                        margin:10px 0;
                    }
                    .new_post_type input{
                        width:100%;
                    }
                    .bar{
                        width:100%;
                        display:flex;
                        flex-flow:row nowrap;
                        justify-content:space-between;
                    }
                    .new_post_type button{
                        margin: 10px 0;
                    }
                    `
                }
            </style>
        </div>
    )
}