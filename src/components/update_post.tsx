import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { get_post } from "../api/get_posts_controllers"
import GlobalAppContext from "../context/app/app_state"
import { TCategoria, TGetMediaFiles, TGetPost, TMeta, TTipoPost } from "../interfaces/interfaces"

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
    const div_parent = document.getElementById('inputs_metas')
    const new_div = document.createElement('div')
    const input_clave = document.createElement('input')
    const input_contenido = document.createElement('input')
    const span = document.createElement('span')
    const span_2 = document.createElement('span')

    const label_1 = document.createElement('label')
    const label_2 = document.createElement('label_2')

    label_1.textContent='Clave'
    label_2.textContent='Contenido'
    span_2.textContent=''


    input_clave.name = 'clave'
    input_clave.placeholder = 'Clave'
    input_contenido.name = 'contenido'
    input_contenido.placeholder = 'contenido'
    span.onclick = delete_meta
    span.textContent = '-'

    input_clave.style.background='var(--primary-color)'
    input_clave.style.width='95%'
    input_clave.style.borderRadius='5px'
    input_clave.style.border='2px solid var(--secondary-color)'
    input_clave.style.padding='5px 10px'
    input_clave.style.margin='5px 0px'

    input_contenido.style.background='var(--primary-color)'
    input_contenido.style.width='95%'
    input_contenido.style.borderRadius='5px'
    input_contenido.style.border='2px solid var(--secondary-color)'
    input_contenido.style.padding='5px 10px'
    input_contenido.style.margin='5px 0px'

    span.style.width='20px'
    span.style.height='20px'
    span.style.cursor='pointer'
    span.style.border='2px solid darkorange'
    span.style.textAlign='center'
    span.style.lineHeight='1'
    span.style.borderRadius='50%'

    new_div.style.display='grid'
    new_div.style.gridTemplateColumns = '1fr 1fr 50px'

    if(div_parent){
        new_div.appendChild(label_1)
        new_div.appendChild(label_2)
        new_div.appendChild(span_2)
        new_div.appendChild(input_clave)
        new_div.appendChild(input_contenido)
        new_div.appendChild(span)

        div_parent.appendChild(new_div)
    }
    
}
const delete_meta = (e:any)=>{
    e.target.parentElement.remove()
}
const prepare_post=(e:any)=>{
    e.preventDefault()
    const {meta_desc,titulo,keywords,cover}:any = e.target 
    
    //Seleccionamos los matas
    const post_metas:any[] = []
    let div_metas = e.target.querySelector('#inputs_metas').querySelectorAll('div')
    for(let div of div_metas){
        const clave = div.querySelector('input[name=clave]')
        const contenido = div.querySelector('input[name=contenido]')
        post_metas.push({clave:clave.value,contenido:contenido.value})
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
        contenido:meta_desc.value,
        keywords:keywords.value,
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
    const params = useParams<any>()

    const set_post = useCallback( async()=>{
       
        const response = await get_post({url:params.id})
        setData(response)
        setCovers(response.covers)
    
    },[params.id])

    const update_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas}:any = prepare_post(e)
        if(!post || !post_metas) return
        if(!data || !data.post) return alert('no hay id de post')
        
        const res = await http_update_post({_id:data.post._id,post,post_metas,covers})
        if(!res) return alert('error')
        alert('ok')
    }
    const delete_post= async ()=>{
        if(!data || !data.post) return
        const deleted = await http_delete_post({_id:data.post._id})
        if(deleted) return alert('post eliminado')
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
            <form onSubmit={(e:any)=>update_post_handler(e)} >
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
                            covers.map(cover=>(<li style={{position:'relative',listStyle:'none',margin:'5px',width:'100px',height:'100px'}} key={cover._id} ><span onClick={()=>delete_cover_handler(cover.path)}  style={{position:'absolute',right:0,top:0,fontWeight:'bold',cursor:'pointer'}} >X</span><img style={{objectFit:'contain',width:'100%',height:'100%'}} src={process.env.REACT_APP_API+cover.url} alt={cover.filename} /></li>))
                        ):null
                    }
                    </ul>
                </div>

                <div>
                    {/** Meta content */}
                    <div>
                        <label>Meta decription</label>
                        <input type="text" name="meta_desc" required placeholder="meta description" defaultValue={data?.post?.contenido} />
                    </div>
                    {/** Meta keywords*/}
                    <div>
                        <label>Meta keywords</label>
                        <input type="text" name="keywords" required placeholder="cellunatic,forros,items..." defaultValue={data?.post?.keywords}/>
                    </div>
                </div>

                {/** categorias y metas del post*/}
                <div>
                    {/** post metas se van anadiendo inputs virtualmente segun se necesiten*/}
                    <div id="inputs_metas" >
                        <label> Meta info del post <button onClick={addMeta}>+</button></label>
                        {
                            data && data.metas.length > 0?(
                                data?.metas.map((meta:TMeta)=>(
                                    <div key={meta._id}>
                                        <label>Clave</label><label>Contenido</label><span></span>
                                        <input name="clave" placeholder="Clave" defaultValue={meta.clave}/>
                                        
                                        <input name="contenido" placeholder="contenido" defaultValue={meta.contenido} />
                                        <span onClick={delete_meta} >-</span>
                                    </div>
                                ))
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
            <style>
                {
                    `
                    form > div{
                        display:grid;
                        grid-template-columns:1fr;
                        gap:20px;
                    }
                    
                    input,select{
                        width:95%;
                        border-radius:6px;
                        border:2px solid var(--secondary-color);
                        margin:5px 0;
                    }
                    
                    #inputs_categorias > div{
                        display:flex;
                        flex-flow:rows wrap;
                        align-items:flex-start;
                        align-content:flex-start;
                    }
                    form .cover_preview{
                        width:100%;
                        height:90%;
                    }
                    form .cover_preview img{
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    }
                    #inputs_categorias span,#inputs_categorias span input{
                        margin:2px;
                    }
                    @media(min-width:960px){
                        form > div{
                            grid-template-columns:repeat(2,1fr);
                        }
                        form .cover_preview ul{
                            grid-column:1 / span 2;
                        }
                    }
                    `
                }
            </style>
        </section>
    )
}

export default UpdatePost