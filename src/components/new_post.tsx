import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import GlobalAppContext from "../context/app/app_state"
import { TCategoria, TGetMediaFiles, TMediaFile, TTipoPost } from "../interfaces/interfaces"

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
    const div_parent = document.getElementById('inputs_metas')
    const new_div = document.createElement('div')
    const input_clave = document.createElement('input')
    const input_contenido = document.createElement('input')
    const span = document.createElement('span')
    const span_2 = document.createElement('span')

    const label_1 = document.createElement('label')
    const label_2 = document.createElement('label')

    label_1.textContent='Clave'
    label_2.textContent='Valor'
    span_2.textContent=''


    input_clave.name = 'clave'
    input_clave.placeholder = 'Clave'
    input_contenido.name = 'valor'
    input_contenido.placeholder = 'valor'
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
    const inputs:HTMLInputElement[] = e.target.querySelectorAll('input') 
    const tipo = e.target.querySelector('select[name=tipo]') 
    const post:any={}
    for(let input of inputs){
        if(input.name!=='categoria' && input.name !== 'clave' && input.name !== 'contenido' && input.value===''){
            alert('debe rellenar, '+input.name)
            return {post:null,post_metas:null}
        }
        if(input.name!=='categoria' && input.name!=='file'){
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
    return {post,post_metas,post_categorias}
}
const NewPost = () => {
    const {goBack} = useHistory()
    const {app} = useContext(GlobalAppContext)
    const [covers,setCovers] = useState<TGetMediaFiles[]>([])

    const create_post_handler=async(e:any)=>{
        e.preventDefault()
        
        const {post,post_metas,post_categorias}:any = prepare_post(e)
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
            <form onSubmit={create_post_handler} >
                {/**Cover */}
                <div>
                    {/** titulo requerido*/}
                    <div>
                        <label>Titulo</label>
                        <input type="text" name="titulo" required placeholder="titulo"/>
                    </div>
                    {/** tipo de post requerido*/}
                    <div>
                        <label>Tipo de post</label>
                        <select name="tipo" required>
                            {
                                app.tipos_state && app.tipos_state.length > 0?(
                                    app.tipos_state.map((tipo:TTipoPost)=>(
                                        <option key={tipo._id} value={tipo.url}>{tipo.titulo}</option>
                                    ))
                                ):null
                            }
                        </select>
                    </div>
                    <div className="box_img" >
                        <label>Covers</label>
                        <div className="input_covers">
                            <input onChange={upload_cover_handler} type="file" multiple />
                        </div>
                    </div>

                    <div>
                        {/** Meta content */}
                        <div>
                            <label>Meta decription</label>
                            <input type="text" name="meta_desc" required placeholder="meta description" />
                        </div>
                        {/** Meta keywords*/}
                        <div>
                            <label>Meta keywords</label>
                            <input type="text" name="keywords" required placeholder="cellunatic,forros,items..." />
                        </div>
                    </div>
                    
                    {/** post metas se van anadiendo inputs virtualmente segun se necesiten*/}
                    <div id="inputs_metas" >
                        <label> Meta info del post <button onClick={addMeta}>+</button>  </label>
                                          
                    </div>
                </div>
                {/** covers post */}
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
                    <button>Crear post</button>
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
            </form>
            <div>  <Link to="/cpanel" ><button>Volver</button></Link> </div>
            <style>
                {
                    `
                    form {
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
                    form .cover_preview{
                        width:90%;
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
                        form {
                            grid-template-columns:repeat(2,1fr);
                        }
                    }
                    `
                }
            </style>
        </section>
    )
}

export default NewPost