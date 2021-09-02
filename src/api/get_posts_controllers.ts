

type GetPostsParams={
    tipo?:string
    estado?:string
    categoria?:string
    limite?:number
}
export const get_posts = async({tipo,estado,limite,categoria}:GetPostsParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/posts/${tipo?tipo:'any'}/${estado?estado:'any'}/${categoria?categoria:'any'}/${limite?limite:10}`)
    return await request.json()
}
type GetPostParams={
    tipo?:string
    estado?:string
    url:string
}
export const get_post = async({tipo,url,estado}:GetPostParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/post/${tipo?tipo:'any'}/${url}/${estado?estado:''}`)
    return await request.json()
}