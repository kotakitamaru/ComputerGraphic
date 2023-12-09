import NavButton from "./navButton.tsx";
import fractalImage from "../../assets/images/fractal.png"
import colorsImage from "../../assets/images/colors.png"
import affineImage from "../../assets/images/affine.png"
import "./index.css"
import learningIcon from "../../assets/images/learning.png"
import {NavLink} from "react-router-dom";
function HomePage(){
    return <div className="pageDiv">
        <NavLink to="/learning-material">
        <button className="learningButton">
            <img src={learningIcon} alt="Download icon"/>
        </button>
        </NavLink>
        <main className="navWindow">
            <aside className="sideTitle">
                <span>f</span>
                <span>r</span>
                <span>a</span>
                <span>c</span>
                <span>t</span>
                <span>a</span>
                <span>l</span>
                <span>s</span>
            </aside>
            <nav className="navContainer">
                    <NavButton to="fractals" name="Fractals" image={fractalImage}/>
                    <NavButton to="colors" name="Colors" image={colorsImage}/>
                    <NavButton to="affine" name="Affine" image={affineImage}/>
            </nav>
        </main>
    </div>
}

export default HomePage;