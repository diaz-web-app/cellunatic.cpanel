import { useContext } from "react"
import { delete_categoria, get_categorias } from "../api/get_categorias_controllers"
import GlobalAppContext from "../context/app/app_state"
import { TCategoria } from "../interfaces/interfaces"

export const TableCategorias = ()=>{
    const {app,app_dispatch} = useContext(GlobalAppContext)
    const set_categories = async()=>{
        const categorias = await get_categorias({})
        app_dispatch({
            type:'get_categorias',
            payload:categorias
        })
    }
    const delete_handler = async(_id:string)=>{
        const deleted = await delete_categoria({_id})
        if(!deleted) return alert('error')
        await set_categories()
    }
    return(
        <table style={{minWidth:'300px'}} >
            <thead>
                <tr>
                    <td>titulo</td>
                    <td>url</td>
                    <td>opciones</td>
                </tr>
            </thead>
            <tbody>
            {
                app.categorias_state && app.categorias_state.length > 0? (
                    app.categorias_state.map((categoria:TCategoria,i:number)=>{
                        return (
                            <tr key={i}>
                                <td>{categoria.titulo}</td>
                                <td>{categoria.url}</td>
                                <td><button onClick={()=>delete_handler(categoria._id)} >Eliminar</button></td>
                            </tr>
                        )}
                    )
                ):null
            }
            </tbody>
        </table>
    )
}