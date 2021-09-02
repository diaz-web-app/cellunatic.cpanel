import { useContext } from "react"
import { Link, useHistory } from "react-router-dom"
import GlobalAppContext from "../../context/app/app_state"
import { TCategoria, TTipoPost } from "../../interfaces/interfaces"

type CreateParams={
    post:any
    post_metas:any[]
    post_categorias:any[]
}
const http_create_post=async({post,post_metas,post_categorias}:CreateParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts`,{
        method:'post',
        body:JSON.stringify({post,post_metas,post_categorias}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 500) return false
    return true
}

const prepare_post=(e:any)=>{
    const inputs:HTMLInputElement[] = e.target.querySelectorAll('input') 
    const tipo = e.target.querySelector('select[name=tipo]') 
    const post:any={}
    for(let input of inputs){
        if(input.name!=='categoria' && input.name !== 'clave' && input.name !== 'contenido' && input.value===''){
            alert('debe rellenar, '+input.name)
            return {post:null,post_metas:null}
        }
        if(input.name!=='categoria' && input.name!=='cover' && input.name!=='file'){
            if(input.name === 'meta_desc'){
                post['contenido'] = input.value
            }
            post[input.name] = input.value
        }
    }
    post['tipo'] = tipo?tipo.value:'post'
    //Seleccionamos los matas
    const post_metas:any[] = []
    let div_metas = e.target.querySelector('#inputs_metas').querySelectorAll('div')
    for(let div of div_metas){
        const clave = div.querySelector('input[name=clave]')
        const valor = div.querySelector('input[name=valor]')
        post_metas.push({clave:clave.value,contenido:valor.value})
    }
    //Seleccionamos las categorias
    const post_categorias:any[] = []
    let inputs_categoria:HTMLInputElement[] = e.target.querySelectorAll('input[name=categoria]')
    for(let input of inputs_categoria){
        if(input.checked){
            post_categorias.push(input.value)
        }
    }
    console.log(post)
    return {post,post_metas,post_categorias}
}
export const TiposPost = () => {
    const {goBack} = useHistory()
    const {app} = useContext(GlobalAppContext)
    const create_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas,post_categorias}:any = prepare_post(e)
        if(!post || !post_metas || !post_categorias) return
        
        const res = await http_create_post({post,post_metas,post_categorias})
        if(!res) return alert('error')
        alert('ok')
        goBack()
    }
    
    return (
        <section>
            <form onSubmit={create_post_handler} >
                
                <div>
                    <label>Titulo</label>
                    <input type="text" name="titulo"/>
                </div>
                {/** categorias del post*/}
                <div>
                    
                    {/** categorias del post*/}
                    <div id="inputs_categorias" >
                        <label>Categorias</label>
                        <div>
                            {
                                app.categorias_state && app.categorias_state.length > 0?(
                                    app.categorias_state.map((categoria:TCategoria)=>(
                                        <span key={categoria._id} >
                                            <label htmlFor={categoria._id}>{categoria.titulo}</label>
                                            <input id={categoria._id} type="checkbox" name="categoria" value={categoria.url}/>
                                        </span>
                                    ))
                                ):null
                            }                    
                        </div>
                    </div>
                </div>

                <div>
                    <button>Crear post</button>
                </div>                
            </form>
            <div>  <Link to="/cpanel" ><button>Volver</button></Link> </div>
            
        </section>
    )
}

