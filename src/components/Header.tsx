import {Link} from 'react-router-dom'
import { useContext } from 'react'
import GlobalAppContext from '../context/app/app_state'

const Header = () => {
    const {app, app_dispatch} = useContext(GlobalAppContext)
    const menu_handler=()=>{
        app_dispatch(
            {
                type:'swich_menu',
                payload:!app.menu_state
            }
        )
    }
    return (
        <header>
            <div className="container header_barr">

                <Link to="/" >
                    <a href="/" className="logo">
                        <img style={{ margin: '0 5px' }} src="/favicon.ico" alt="cellunatic logo" width="32px" height="32px" />
                        <b>Cpanel</b>
                    </a>
                </Link>
                
                <div className="nav_header">                    
                    <button onClick={menu_handler} >menu</button>
                </div>
            </div>

        </header>
    )
}
export default Header