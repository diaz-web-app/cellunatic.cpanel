import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { get_post } from "../api/get_posts_controllers"
import GlobalAppContext from "../context/app/app_state"
import { TCategoria, TGetMediaFiles, TGetPost, TMeta } from "../interfaces/interfaces"

type UpdateParams={
    post:any
    post_metas:any[]
    _id:string
    covers:TGetMediaFiles[]
}

const http_update_post=async({post,post_metas,_id,covers}:UpdateParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts`,{
        method:'put',
        body:JSON.stringify({post,post_metas,_id,covers}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 500) return false
    return true
}
type DeleteParams={
    _id:string
}
const http_delete_post=async({_id}:DeleteParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts`,{
        method:'delete',
        body:JSON.stringify({_id}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 500) return false
    return true
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
const prepare_post=(e:any)=>{
    e.preventDefault()
    const {meta_desc,titulo,meta_keywords,cover}:any = e.target 
    
    //Seleccionamos los matas
    const post_metas:any[] = []
    let div_metas = e.target.querySelector('#inputs_metas').querySelectorAll('div')
    for(let div of div_metas){
        const clave = div.querySelector('input[name=clave]')
        const meta_description = div.querySelector('input[name=meta_description]')
        post_metas.push({clave:clave.value,meta_description:meta_description.value})
    }
    //Seleccionamos las categorias
    const categoria:any[] = []
    let inputs_categoria:HTMLInputElement[] = e.target.querySelectorAll('input[name=categoria]')
    for(let input of inputs_categoria){
        if(input.checked){
            categoria.push(input.value)
        }
    }
    const post={
        categoria,
        titulo:titulo.value,
        meta_description:meta_desc.value,
        meta_keywords:meta_keywords.value,
        cover:cover?.value
    }
    return {post,post_metas}
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

const UpdatePost = () => {
    const {app} = useContext(GlobalAppContext)
    const [data,setData] = useState<TGetPost>()
    const [covers,setCovers] = useState<TGetMediaFiles[]>(data?data.covers:[])
    const {goBack} = useHistory()
    const params = useParams<any>()

    const set_post = useCallback( async()=>{
       
        const response = await get_post({url:params.url})
        setData(response)
        setCovers(response.covers)
    
    },[params.url])

    const update_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas}:any = prepare_post(e)
        if(!post || !post_metas) return
        if(!data || !data.post) return alert('no hay id de post')
        
        const res = await http_update_post({_id:data.post._id,post,post_metas,covers})
        if(!res) return alert('error')
        alert('ok')
        goBack()
    }
    const delete_post= async ()=>{
        if(!data || !data.post) return
        const deleted = await http_delete_post({_id:data.post._id})
        if(deleted) alert('post eliminado')
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
    
    useEffect(()=>{
        set_post()
    },[set_post])
    return (
        <section>
            <form className="form_manage_posts" onSubmit={(e:any)=>update_post_handler(e)} >
                {/** titulo y Tipo de post */}
                <div>
                    {/** titulo requerido*/}
                    <div>
                        <label>Titulo</label>
                        
                        <input type="text" name="titulo" required placeholder="titulo" defaultValue={data?.post?.titulo}/>
                    </div>
                   
                    <div>
                        <label>Covers</label>
                        <div className="input_covers">
                            <input onChange={upload_cover_handler} type="file" multiple />
                        </div>
                    </div>
                </div>

                <div className="cover_preview" >
                    <ul style={{display:'flex',flexFlow:'row wrap'}} >
                    {
                        covers.length > 0?(
                            covers.map(cover=>(<li style={{position:'relative',listStyle:'none',margin:'5px',width:'100px',height:'100px'}} key={cover._id} ><span onClick={()=>delete_cover_handler(cover.path)}  style={{position:'absolute',right:0,top:0,fontWeight:'bold',cursor:'pointer'}} >X</span><img style={{objectFit:'contain',width:'100%',height:'100%'}} src={cover.url} alt={cover.filename} /></li>))
                        ):null
                    }
                    </ul>
                </div>

                <div>
                    {/** Meta content */}
                    <div>
                        <label>Meta decription</label>
                        <input type="text" name="meta_desc" required placeholder="meta description" defaultValue={data?.post?.meta_description} />
                    </div>
                    {/** Meta meta_keywords*/}
                    <div>
                        <label>Meta meta_keywords</label>
                        <input type="text" name="meta_keywords" required placeholder="cellunatic,forros,items..." defaultValue={data?.post?.meta_keywords}/>
                    </div>
                </div>

                {/** categorias y metas del post*/}
                <div>
                    {/** post metas se van anadiendo inputs virtualmente segun se necesiten*/}
                    <div id="inputs_metas" >
                        <label> Meta info del post <button onClick={addMeta}>+</button></label>
                        {
                            data && data.metas.length > 0?(
                                data?.metas.map((meta:TMeta)=>{
                                    return (
                                        <div key={meta._id} className="meta_div" style={{display:'grid'}}>
                                            <label>Clave</label>
                                            <input name="clave" placeholder="Clave" defaultValue={meta.clave}/>

                                            <label>valor</label>
                                            <input name="valor" placeholder="valor" defaultValue={meta.valor} />

                                            <label>visible</label>
                                            <input type="checkbox" name="vista" defaultChecked={meta.vista} />
                                            <span onClick={delete_meta} >-</span>
                                        </div>
                                    )
                                })
                            ):null
                        }
                                          
                    </div>
                    
                    {/** categorias del post*/}
                    <div id="inputs_categorias" >
                        <label>Categorias</label>
                        <div>
                            {
                                data && app.categorias_state && app.categorias_state.length > 0?(
                                    app.categorias_state.map((categoria:TCategoria)=>{
                                        const checked = data.post?.categoria.find(cat=>cat===categoria.url)
                                        return (
                                        <span key={categoria._id} >
                                            <label htmlFor={categoria._id}>{categoria.titulo}</label>
                                            <input id={categoria._id} type="checkbox" name="categoria" defaultChecked={checked===categoria.url?true:false} value={categoria.url}/>
                                        </span>
                                    )})
                                ):null
                            }                    
                        </div>
                    </div>
                </div>
                <div>
                    <button>Actualizar post</button> <span onClick={delete_post} >Delete</span>
                </div>
            </form>
        </section>
    )
}

export default UpdatePost