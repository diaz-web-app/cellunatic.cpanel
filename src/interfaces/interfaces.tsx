//****** */ posts ******//
export type TPost={
      categoria: string[]
      estado: string
      _id:string
      titulo:string
      contenido:string
      keywords:string
      html?: string
      tipo:string
      url:string
      cover?:string
      createdAt:string
      updatedAt:string
}

export type TGetPosts= {
    posts:TPost[] 
    metas:TMeta[]
    total_posts:number
}
export type TGetPost= {
    post:TPost | null
    metas:TMeta[]
    covers:TGetMediaFiles[]
}
//****** post metas ******//
export type TMeta={
    _id: string
    id_post: string
    clave: string
    contenido: string
    createdAt: string
    updatedAt: string
}
//****** post categorias ******//
export type TCategoria={
    tipo_post: string[]
    _id: string
    titulo: string
    url: string
    createdAt: string
    updatedAt: string
}
export type TGetCategoria = TCategoria[] | []
export type TTipoPost={
    _id: string
    titulo: string
    url: string
    createdAt: Date
    updatedAt: Date
}
export type TGetTiposPost = TTipoPost[] | []
//*******Media types ********//

export type TMediaFile={
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
    url: string
}

export type TGetMediaFiles={
    _id: string
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
    url: string
    id_post?: string
    createdAt: Date
    updatedAt: Date
}

//****** Estado de la app ******//
export type State = {
    paginas_state:TGetPosts | null
    accesorios_state:TGetPosts | null
    posts_state:TGetPosts | null
    post_state:TGetPost 
    menu_state:boolean
    tipos_state:TGetTiposPost | null
    categorias_state:TGetCategoria | null
    metas_state:any | null
} 

export type AppActions =
    | { type: 'swich_menu',payload:any}
    | { type: 'get_posts',payload:TGetPosts | null}
    | { type: 'get_post',payload:TGetPost}
    | { type: 'get_paginas',payload:TGetPosts | null}
    | { type: 'get_accesorios',payload:TGetPosts | null}
    | { type: 'get_tipos',payload:TGetTiposPost | null}
    | { type: 'get_categorias',payload:TGetCategoria | null}
    | { type: 'get_metas',payload:any}