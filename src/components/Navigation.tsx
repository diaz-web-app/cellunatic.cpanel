import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import GlobalAppContext from '../context/app/app_state'
import { TTipoPost } from '../interfaces/interfaces'

const Navigation = () => {
    const {app} = useContext(GlobalAppContext)
    return (
            <>
                <nav className="principal" >
                    <li>
                        <Link to="/cpanel" ><a href="/cpanel" >Dashboard</a></Link>
                    </li>
                    {
                        app.tipos_state && app.tipos_state.length > 0 ?(
                            app.tipos_state.map((tipo:TTipoPost)=>{
                                return(
                                    <li key={tipo._id}>
                                        <Link to={"/"+tipo.url} ><a href={"/"+tipo.url}>{tipo.titulo}</a></Link>
                                    </li>
                                )
                            })
                        ):null
                    }
                </nav>

                <style>{
                    `
                    /*Nav */
                    nav li{
                        list-style:none;
                    }
                        nav.principal{
                            width:200px;
                            left:${app.menu_state?'0':'-200px'};
                        }
                        @media(min-width:960px){
                            main > section{
                                margin-left:${app.menu_state?'200px':'0'};
                                width:100%;
                            } 
                        }
                    `
                }
                </style>
            </>
        )
                
}
export default Navigation