import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import {useParams} from 'react-router'
import GlobalAppContext from "../context/app/app_state"
import { TCategoria, TGetMediaFiles, TMediaFile} from "../interfaces/interfaces"

type CreateParams={
    post:any
    post_metas:any[]
    post_categorias:any[],
    covers:TMediaFile[]
}
const http_create_post=async({post,post_metas,post_categorias,covers}:CreateParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts`,{
        method:'post',
        body:JSON.stringify({post,post_metas,post_categorias,covers}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 500) return false
    return true
}
const upload_cover=async(files:any[])=>{
    const form = new FormData()
    
    for(let file of files){
        form.append('cover',file)
    }
    const request = await fetch(`${process.env.REACT_APP_API}/covers`,{
        method:'post',
        body:form
    })
    const resp = await request.json()
    if(request.status === 200){
        return resp
    }
    return false
    
}
type TDeleteProps={
    path:string
}
const delete_cover = async({path}:TDeleteProps)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/covers`,{
        method:'delete',
        body:JSON.stringify({path}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 200){
        return await request.json()
    }
    return  false
}
const addMeta=(e:FormEvent)=>{
    e.preventDefault()
    const div_hijo = document.getElementById('inputs_metas')
    const div_container = document.createElement('div')
    const input_clave = document.createElement('input')
    const input_valor = document.createElement('input')
    const input_vista = document.createElement('input')
    const span = document.createElement('span')

    const label_1 = document.createElement('label')
    const label_2 = document.createElement('label')
    const label_3 = document.createElement('label')

    label_1.textContent='Clave'
    label_2.textContent='Valor'
    label_3.textContent='visible'
    


    input_clave.name = 'clave'
    input_clave.placeholder = 'Clave'
    input_valor.name = 'valor'
    input_valor.placeholder = 'valor'
    input_vista.name = 'vista'
    span.onclick = delete_meta
    span.textContent = '-'


    input_clave.type = 'text'
    input_valor.type = 'text'
    input_vista.type = 'checkbox'
    input_vista.checked = false


    div_container.style.display='grid'
    div_container.classList.add('meta_div')

    if(div_hijo){
        
        div_container.appendChild(label_1)
        div_container.appendChild(input_clave)
        div_container.appendChild(label_2)
        div_container.appendChild(input_valor)
        div_container.appendChild(label_3)
        div_container.appendChild(input_vista)
        div_container.appendChild(span)

        div_hijo.appendChild(div_container)
    }
    
}
const delete_meta = (e:any)=>{
    e.target.parentElement.remove()
}
type Prepare_post={
    e:any
    tipo:string
}
const prepare_post=({e,tipo}:Prepare_post)=>{
    const inputs:HTMLInputElement[] = e.target.querySelectorAll('input') 
    const post:any={}
    post['tipo'] = tipo
    for(let input of inputs){
        if(input.name!=='categoria' && input.name !== 'clave' && input.name !== 'valor' && input.name !== 'vista' && input.value===''){
            alert('debe rellenar, '+input.name)
            return {post:null,post_metas:null}
        }
        if(input.name!=='categoria' && input.name!=='file' && input.name !== 'clave' && input.name !== 'valor' && input.name !== 'vista'){
            if(input.name === 'meta_desc'){
                post['meta_description'] = input.value
            }
            if(input.name === 'meta_keywords'){
                post['meta_keywords'] = input.value
            }
            post[input.name] = input.value
        }
    }
    
    //Seleccionamos los matas
    const post_metas:any[] = []
    let div_metas = e.target.querySelector('#inputs_metas').querySelectorAll('div')
    for(let div of div_metas){
        const clave = div.querySelector('input[name=clave]')
        const valor = div.querySelector('input[name=valor]')
        const vista = div.querySelector('input[name=vista]')
        post_metas.push({clave:clave.value,valor:valor.value,vista:vista.checked})
    }
    //Seleccionamos las categorias
    const post_categorias:any[] = []
    let inputs_categoria:HTMLInputElement[] = e.target.querySelectorAll('input[name=categoria]')
    for(let input of inputs_categoria){
        if(input.checked){
            post_categorias.push(input.value)
        }
    }
    return {post,post_metas,post_categorias}
}

const NewPost = () => {
    const {goBack} = useHistory()
    const {app} = useContext(GlobalAppContext)
    const [covers,setCovers] = useState<TGetMediaFiles[]>([])
    const params = useParams<any>()

    const create_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas,post_categorias}:any = prepare_post({e,tipo:params.type})
        if(!post || !post_metas || !post_categorias) return
        
        const res = await http_create_post({post,post_metas,post_categorias,covers})
        if(!res) return alert('error')
        alert('ok')
        goBack()
    }
    const upload_cover_handler=async(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.parentElement){
            const {files}:any = e.target
            const imgs = await upload_cover(files)
            
            if(!imgs) return alert('hubo un error')
            for(let img of covers){
                imgs.push(img)
            }
            setCovers(imgs.reverse())
        }
    }
    const delete_cover_handler=async(path:string)=>{
        const deleted = await delete_cover({path})
        if(deleted){
            return setCovers(covers.filter(cover=>cover.path !== deleted.path))
        }
    }
    
    return (
        <section>
            <form className="form_manage_posts" onSubmit={create_post_handler} >
                {/**Cover */}
                <div>
                    {/** titulo requerido*/}
                    <div>
                        <label>Titulo</label>
                        <input type="text" name="titulo" required placeholder="titulo"/>
                    </div>

                    <div>
                        <label>Covers</label>
                        <div className="input_covers">
                            <input onChange={upload_cover_handler} type="file" multiple />
                        </div>
                    </div>
                    
                </div>

                {/** covers post */}
                <div className="cover_preview" >
                    <ul style={{display:'flex',flexFlow:'row wrap'}} >
                    {
                        covers.length > 0?(
                            covers.map(cover=>(<li style={{position:'relative',listStyle:'none',margin:'5px',width:'100px',height:'100px'}} key={cover._id} ><span onClick={()=>delete_cover_handler(cover.path)}  style={{position:'absolute',right:0,top:0,fontWeight:'bold',cursor:'pointer'}} >X</span><img style={{objectFit:'contain',width:'100%',height:'100%'}} src={cover.url} alt={cover.filename} /></li>))
                        ):null
                    }
                    </ul>
                </div>

                {/** tipo de post requerido*/}
                {
                    params.type=='pagina'?(
                        <div>
                            <div>
                                <label>Post hijo</label>
                                <input list="hijo" type="text" name="padre" required/>
                                <datalist id="hijo">
                                    {
                                        app.tipos_state && app.tipos_state.length > 0?(
                                            app.tipos_state.map((tipo)=>(
                                                <option key={tipo._id} value={tipo.url}>titulo: {tipo.titulo}</option>
                                            ))
                                        ):null
                                    }
                                </datalist>
                            </div>
                        </div>
                    ):null
                }

                <div>
                    {/** Meta content */}
                    <div>
                        <label>Meta decription</label>
                        <input type="text" name="meta_desc" required placeholder="meta description" />
                    </div>
                    {/** Meta meta_keywords*/}
                    <div>
                        <label>Meta meta_keywords</label>
                        <input type="text" name="meta_keywords" required placeholder="cellunatic,forros,items..." />
                    </div>
                </div>
                <div>
                    {/** post metas se van anadiendo inputs virtualmente segun se necesiten*/}
                    <div id="inputs_metas" >
                        <label> Meta info del post <button onClick={addMeta}>+</button>  </label>
                                          
                    </div>
                    <div id="inputs_categorias" >
                        <label>Categorias</label>
                        <div>
                            {
                                app.categorias_state && app.categorias_state.length > 0?(
                                    app.categorias_state.map((categoria:TCategoria)=>{
                                        return (
                                            
                                            categoria.tipo_post == params.type?(
                                                <span key={categoria._id} >
                                                    <label htmlFor={categoria._id}>{categoria.titulo}</label>
                                                    <input id={categoria._id} type="checkbox" name="categoria" value={categoria.url}/>
                                                </span>
                                            ):null
                                            
                                        )
                                    })
                                ):null
                            }                    
                        </div>
                    </div>
                </div>
                
                <div>
                    <button>Crear post</button>
                </div>
            
            </form>
            <div> <button onClick={()=>goBack()} >Volver</button></div>
        </section>
    )
}

export default NewPost