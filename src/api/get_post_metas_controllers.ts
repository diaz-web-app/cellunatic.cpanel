type TGetpost_metasParams={
    id_post?:string
}
export const get_post_metas=async({id_post}:TGetpost_metasParams)=>{
    const request = await fetch(`${process.env.REACT_APP_API}/post_metas/${id_post?id_post:''}`)
    return await request.json()
}