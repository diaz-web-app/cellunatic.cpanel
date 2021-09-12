import { useContext } from "react"
import { delete_tipo, get_tipos_post } from "../api/get_tipos_post_controllers"
import GlobalAppContext from "../context/app/app_state"
import { TTipoPost } from "../interfaces/interfaces"

export const TableTipos = ()=>{
    const {app,app_dispatch} = useContext(GlobalAppContext)
    const set_types = async()=>{
        const categorias = await get_tipos_post({})
        app_dispatch({
            type:'get_tipos',
            payload:categorias
        })
    }
    const delete_handler = async(_id:string)=>{
        const deleted = await delete_tipo({_id})
        if(!deleted) return alert('error')
        await set_types()
    }
    return(
        <table className="table_small" style={{minWidth:'300px'}} >
            <thead>
                <tr>
                    <td>titulo</td>
                    <td>url</td>
                    <td>opciones</td>
                </tr>
            </thead>
            <tbody>
            {
                app.tipos_state && app.tipos_state.length > 0? (
                    app.tipos_state.map((tipo:TTipoPost,i:number)=>{
                        return (
                            <tr key={i}>
                                <td>{tipo.titulo}</td>
                                <td>{tipo.url}</td>
                                <td><button onClick={()=>delete_handler(tipo._id)} >Eliminar</button></td>
                            </tr>
                        )}
                    )
                ):null
            }
            </tbody>
        </table>
    )
}