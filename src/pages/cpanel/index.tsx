import { useContext, useEffect } from "react"
import { get_categorias } from "../../api/get_categorias_controllers"
import { get_tipos_post } from "../../api/get_tipos_post_controllers"
import { TableTipos } from "../../components/table_tipos"
import { TableCategorias } from "../../components/table_categorias"
import GlobalAppContext from "../../context/app/app_state"
import { NewPostType } from "../../components/New_post_type"
import { NewCategoria } from "../../components/New_category"

const Cpanel = () => {
    const {app_dispatch} = useContext(GlobalAppContext)
    const prepare_posts=async()=>{
        const tipos_post = await get_tipos_post({})
        const categorias = await get_categorias({})
        app_dispatch(
            {
                type:'get_tipos',
                payload:tipos_post
            }
        )
        app_dispatch({
            type:'get_categorias',
            payload:categorias
        })
    }
    
    useEffect(()=>{
        prepare_posts()
    },[])

    return (
        <>
            <section>
                <h1>Este es el cpanel</h1>
                <article className="tipos_categorias" >
                    <div className="tipos box_white"> 

                        {<NewPostType titulo="Tipos de posts" btn_text="Nuevo" />}
                        <div className="table_container">
                            <TableTipos/>
                        </div>
                    </div>
                    <div className="cats box_white">
                        
                        {<NewCategoria titulo="Categorias" btn_text="Nuevo"/>}
                        <div className="table_container">
                            <TableCategorias/>
                        </div>
                    </div>
                </article>                
            </section>
            <style>
                {
                    `
                    .tipos_categorias{
                        display:grid;
                        grid-template-columns:repeat(1,1fr);
                        gap:10px;
                    }
                    @media(min-width:680px){
                        .tipos_categorias{
                            grid-template-columns:repeat(2,1fr);
                        }
                    }
                    `
                }
            </style>
        </>
    )
}

export default Cpanel