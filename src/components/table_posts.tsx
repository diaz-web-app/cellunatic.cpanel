import { useContext } from "react"
import { useHistory } from "react-router"
import GlobalAppContext from "../context/app/app_state"
import { TMeta, TPost } from "../interfaces/interfaces"

export const TablePosts = ()=>{
    const {app,app_dispatch} = useContext(GlobalAppContext)
    const {push} = useHistory()
    const set_post = (metas:TMeta[],post:TPost)=>{
        app_dispatch({
            type:'set_post',
            payload:{metas,post}
        })
        push('/the_post')
    }
    return(
        <table style={{width:'100%'}} >
            <thead>
                <tr>
                    <td>titulo</td>
                    <td>tipo</td>
                    <td>opciones</td>
                </tr>
            </thead>
            <tbody>
            {
                app.posts_state && app.posts_state.total_posts > 0? (
                    app.posts_state.posts.map((post,i:number)=>{
                    const the_metas = app.posts_state?.metas.filter(meta=>meta.id_post===post._id)
                        return (
                            <tr key={i}>
                                <td>{post.titulo}</td>
                                <td>{post.tipo}</td>
                                <td><button onClick={()=>set_post(the_metas?the_metas:[],post)} >Editar</button></td>
                            </tr>
                        )}
                    )
                ):null
            }
            </tbody>
        </table>
    )
}