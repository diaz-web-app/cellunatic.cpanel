import React, { useContext, useState } from 'react'
import { create_categoria } from '../api/get_categorias_controllers'
import { get_categorias } from '../api/get_categorias_controllers'
import GlobalAppContext from '../context/app/app_state'

type Props={
    titulo:string
    btn_text:string
}
export const NewCategoria=({titulo,btn_text}:Props)=>{
    const {app_dispatch,app} = useContext(GlobalAppContext)
    const [show,setShow] = useState<boolean>(false)
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
        const {titulo,tipo_post} = e.target
        if(titulo && titulo.value !=='' && tipo_post && tipo_post.value !==''){
            await create_categoria({titulo:titulo.value,tipo_post:tipo_post.value})
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
            <form onSubmit={create_category_handler} className="new_categoria">
                <div>
                    <label>Titulo</label>
                    <input type="text" name="titulo" required/>
                </div>
                
                <div>
                    <label>Tipo de post?</label>
                    <input list="hijo" type="text" name="tipo_post" required/>

                    <datalist id="hijo">
                        {
                            app.tipos_state && app.tipos_state.length > 0?(
                                app.tipos_state.map((tipo)=>(
                                    <option key={tipo._id} value={tipo.url}>tipo existente: {tipo.titulo}</option>
                                ))
                            ):null
                        }
                    </datalist>
                </div>
                
                <div>
                    <button>Crear</button>
                </div>
            </form>
            <style>
                {
                    `
                    .new_categoria{
                        display:${show?'block':'none'};
                        position:relative;
                        margin:10px 0;
                    }
                    .new_categoria input{
                        width:100%;
                    }
                    .bar{
                        width:100%;
                        display:flex;
                        flex-flow:row nowrap;
                        justify-content:space-between;
                    }
                    .new_categoria button{
                        margin: 10px 0;
                    }
                    `
                }
            </style>
        </div>
    )
}