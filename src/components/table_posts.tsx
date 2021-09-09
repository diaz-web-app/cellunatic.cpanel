import { useContext } from "react"
import { useHistory } from "react-router"
import GlobalAppContext from "../context/app/app_state"

export const TablePosts = ()=>{
    const {app} = useContext(GlobalAppContext)
    const {push} = useHistory()
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
                        return (
                            <tr key={i}>
                                <td>{post.titulo}</td>
                                <td>{post.tipo}</td>
                                <td><button onClick={()=>push("/update_post/"+post.url)} >Editar</button></td>
                            </tr>
                        )}
                    )
                ):null
            }
            </tbody>
        </table>
    )
}