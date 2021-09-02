import { useContext, useEffect } from "react"
import { get_posts } from "../../api/get_posts_controllers"
import { UpdatePost } from "../../components/update_post"
import GlobalAppContext from "../../context/app/app_state"
const ThePost = () => {
    const {app_dispatch} = useContext(GlobalAppContext)
    const set_posts = async()=>{
        const response = await get_posts({tipo:'pagina'})
        app_dispatch({
            type:'get_posts',
            payload:response
        })
    }
    useEffect(()=>{
        set_posts()
    },[])
    return (
        <>
            <section>
                <h1>Listado de posts</h1>
                <UpdatePost />
            </section>

        </>
    )
}

export default ThePost