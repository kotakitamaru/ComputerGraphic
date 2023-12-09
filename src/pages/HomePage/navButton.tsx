import {NavLink} from "react-router-dom";
import "./navButton.css";

interface navButtonProps{
    name:string,
    to:string,
    image:string
}

function navButton(props:navButtonProps){
    return <div>
       <NavLink to={props.to}>
           <div className="navButton" >
               <div className="navImage">
                   <img alt={props.name+" nav image"} src={props.image}/></div>
               <div className="navLabel">{props.name}</div>
           </div>
       </NavLink>
    </div>
}
export default navButton;