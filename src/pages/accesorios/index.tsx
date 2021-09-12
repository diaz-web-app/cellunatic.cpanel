import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { get_posts } from "../../api/get_posts_controllers"
import { TablePosts } from "../../components/table_posts"
import GlobalAppContext from "../../context/app/app_state"

const Accesorios = () => {
    const {app,app_dispatch} = useContext(GlobalAppContext)
    const [loader,setLoader] = useState<boolean>(false)
    const set_posts = async(limit?:number)=>{
        setLoader(true)
        const response = await get_posts({tipo:'accesorio',limite:limit?limit:10})
        app_dispatch({
            type:'get_posts',
            payload:response
        })
        setLoader(false)
    }
    useEffect(()=>{
        set_posts()
    },[])
    return (
        <>
            <section className="pages_posts" >
                
                <div className="header_page">
                    <b>Listado de accesorioss</b>
                    <Link to="/new_post"><a href="/new_post" ><button>Añadir nuevo</button></a></Link>
                </div>

                <div className="box_white">
                    <TablePosts />
                </div>
                <button disabled={loader?true:false} onClick={()=>set_posts(app.posts_state?.posts?app.posts_state?.posts.length * 2:10)} >{loader?'espere...':'Ver Más'}</button>
            </section>
        </>
    )
}

export default Accesorios