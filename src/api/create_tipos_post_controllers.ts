type TGetTiposParams={
    titulo:string
}
export const create_tipo_post=async({titulo}:TGetTiposParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/tipos`,{
        method:'post',
        body:JSON.stringify({titulo}),
        headers:{
            "content-type":"application/json"
        }
    })
    return await request.json()
}