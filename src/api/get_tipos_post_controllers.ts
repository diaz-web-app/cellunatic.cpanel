type TGetTiposParams={
    tipo_post?:string
}
export const get_tipos_post=async({tipo_post}:TGetTiposParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/tipos/${tipo_post?tipo_post:''}`)
    return await request.json()
}

type DeleteTipoParams={
    _id:string
}
export const delete_tipo = async({_id}:DeleteTipoParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/tipos`,{
        method:'delete',
        body:JSON.stringify({_id}),
        headers:{
            "content-type":"application/json"
        }
    })
    if(request.status === 200) return await request.json()
    return false
}