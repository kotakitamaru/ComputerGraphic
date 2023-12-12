import {NavLink, useParams} from "react-router-dom";
import ColorsMaterial from "./ColorsMaterial.tsx";
import FractalMaterial from "./FractalsMaterial.tsx";
import AffineMaterial from "./AffineMaterial.tsx";
import "./index.css";
import NoMaterial from "./NoMaterial.tsx";

function LearningPage(){
    let {about} = useParams();

    return <div className="pageDiv">
        <aside className="learningAside">
            <nav className="learningNav">
                <NavLink to="/learning-material/fractals" className="navBtn">Fractals</NavLink>
                <NavLink to="/learning-material/colors" className="navBtn">Colors</NavLink>
                <NavLink to="/learning-material/affine" className="navBtn">Affine</NavLink>
            </nav>
        </aside>
        <main className="learningMain">
            <NavLink to="/" className="homeNavLink">Computer Graphics</NavLink>
            {
                about == "colors"?
                    <ColorsMaterial/>:
                    about == "affine"?
                    <AffineMaterial/>:
                    about == "fractals"?
                    <FractalMaterial/>:
                    <NoMaterial/>
            }
        </main>
    </div>
}

export default LearningPage;