import { ChangeEvent, FormEvent, useContext } from "react"
import GlobalAppContext from "../context/app/app_state"
import { TCategoria, TMeta, TTipoPost } from "../interfaces/interfaces"

type UpdateParams={
    post:any
    post_metas:any[]
    _id:string
}

const http_update_post=async({post,post_metas,_id}:UpdateParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts`,{
        method:'put',
        body:JSON.stringify({post,post_metas,_id}),
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
    const {meta_desc,titulo,keywords,tipo,cover}:any = e.target 
    
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
        tipo:tipo.value,
        cover:cover?.value
    }
    return {post,post_metas}
}
const upload_cover=async(e:any)=>{
    const form = new FormData()
    
    form.append('cover',e)
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
export const UpdatePost = () => {
    const {app} = useContext(GlobalAppContext)
    const update_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas}:any = prepare_post(e)
        if(!post || !post_metas) return
        if(!app.post_state?.post) return alert('no hay id de post')
        console.log(app.post_state.post)
        const res = await http_update_post({_id:app.post_state?.post._id,post,post_metas})
        if(!res) return alert('error')
        alert('ok')
    }
    const delete_post= async ()=>{
        const deleted = await http_delete_post({_id:app.post_state?.post?app.post_state?.post._id:''})
        if(deleted) return alert('post eliminado')
    }
    const upload_cover_handler=async(e:ChangeEvent<HTMLInputElement>)=>{
        
        if(e.target.files && e.target.parentElement){
            const img = await upload_cover(e.target.files[0])
            const cover:HTMLInputElement | null = e.target.parentElement.querySelector('input[name=cover]')
            if(!img) return alert('hubo un error')
            if(cover){
                
                return cover.value = img.url
            }
        }
    }
    return (
        <div>
            <form onSubmit={(e:any)=>update_post_handler(e)} >
                {/** titulo y Tipo de post */}
                <div>
                    {/** titulo requerido*/}
                    <div>
                        <label>Titulo</label>
                        <input type="text" name="titulo" required placeholder="titulo" defaultValue={app.post_state?.post?.titulo}/>
                    </div>
                    {/** tipo de post requerido*/}
                    <div>
                        <label>Tipo de post</label>
                        <select name="tipo" required >
                            <option defaultValue={app.post_state?.post?.tipo}>{app.post_state?.post?.tipo}</option>
                            {
                                app.tipos_state && app.tipos_state.length > 0?(
                                    app.tipos_state.map((tipo:TTipoPost)=>(
                                        <option key={tipo._id} defaultValue={tipo.url}>{tipo.titulo}</option>
                                    ))
                                ):null
                            }
                        </select>
                    </div>
                </div>

                <div>
                    <label>Cover</label>
                    <input onChange={upload_cover_handler} type="file" name="file" />
                    <input type="text" name="cover" defaultValue={app.post_state?.post?.cover} />
                </div>

                <div>
                    {/** Meta content */}
                    <div>
                        <label>Meta decription</label>
                        <input type="text" name="meta_desc" required placeholder="meta description" defaultValue={app.post_state?.post?.contenido} />
                    </div>
                    {/** Meta keywords*/}
                    <div>
                        <label>Meta keywords</label>
                        <input type="text" name="keywords" required placeholder="cellunatic,forros,items..." defaultValue={app.post_state?.post?.keywords}/>
                    </div>
                </div>

                {/** categorias y metas del post*/}
                <div>
                    {/** post metas se van anadiendo inputs virtualmente segun se necesiten*/}
                    <div id="inputs_metas" >
                        <label> Meta info del post <button onClick={addMeta}>+</button></label>
                        {
                            app.post_state && app.post_state.metas.length > 0?(
                                app.post_state?.metas.map((meta:TMeta)=>(
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
                                app.categorias_state && app.categorias_state.length > 0?(
                                    app.categorias_state.map((categoria:TCategoria)=>{
                                        const checked = app.post_state?.post?.categoria.find(cat=>cat===categoria.url)
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
                        padding:2px 4px;
                        border:2px solid var(--secondary-color);
                        background:var(--primary-color);
                        color:white;
                        padding:5px 10px;
                        margin:5px 0;
                    }
                    
                    #inputs_categorias > div{
                        display:flex;
                        flex-flow:rows wrap;
                        align-items:flex-start;
                        align-content:flex-start;
                    }
                    
                    #inputs_categorias span,#inputs_categorias span input{
                        margin:2px;
                    }
                    @media(min-width:960px){
                        form > div{
                            grid-template-columns:repeat(2,1fr);
                        }
                    }
                    `
                }
            </style>
        </div>
    )
}

