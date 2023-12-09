import "./index.css";
import {NavLink} from "react-router-dom";
function NoPage(){
    return <div className="pageDiv">
        <header className="header404">
            <NavLink to="/" className="homeNavLink">Computer Graphics</NavLink>
        </header>
        <main className="main404">
            <span>404</span>
            <span>Page not found <br/> :(</span>
        </main>
    </div>
}

export default NoPage;