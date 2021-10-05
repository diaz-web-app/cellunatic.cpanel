type GetCatParams={
    tipo_post?:string
}
export const get_categorias=async({tipo_post}:GetCatParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/categorias/${tipo_post?tipo_post:''}`)
    return await request.json()
}
type DeleteCatParams={
    _id:string
}

type TCreateParams={
    titulo:string
    tipo_post:string
}
export const create_categoria=async({titulo,tipo_post}:TCreateParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/categorias`,{
        method:'post',
        body:JSON.stringify({titulo,tipo_post}),
        headers:{
            "content-type":"application/json"
        }
    })
    return await request.json()
}

export const delete_categoria = async({_id}:DeleteCatParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/categorias`,{
        method:'delete',
        body:JSON.stringify({_id}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 200) return await request.json()
    return false
}