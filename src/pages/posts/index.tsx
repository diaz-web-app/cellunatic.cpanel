import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { get_posts } from "../../api/get_posts_controllers"
import { TablePosts } from "../../components/table_posts"
import {useParams} from 'react-router'
import GlobalAppContext from "../../context/app/app_state"

const Posts = () => {
    const params = useParams<any>()
    const {app_dispatch} = useContext(GlobalAppContext)
    const set_posts = async()=>{
        const response = await get_posts({tipo:params.type?params.type:'post'})
        app_dispatch({
            type:'get_posts',
            payload:response
        })
    }
    useEffect(()=>{
        set_posts()
    },[params.type])
    return (
        <>
            <section className="pages_posts">
                <div className="header_page">
                    <b>{params.url}</b>
                    <Link to={`/new_post/${params.type}`}><a ><button>Añadir nuevo</button></a></Link>
                </div>
                <div className="box_white">
                    <TablePosts />
                </div>
            </section>
        </>
    )
}

export default Posts