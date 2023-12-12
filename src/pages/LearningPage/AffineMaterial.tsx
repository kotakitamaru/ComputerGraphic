import translateMatrix from "../../assets/images/translateMatrix.png"
import scalingMatrix from "../../assets/images/scalingMatrix.png"
import rotationMatrix from "../../assets/images/rotationMatrix.png"

function AffineMaterial(){
    return <article>
        <section className="section">
            <section className="illustrationSection">
                <h1>Translation matrix</h1>
                <img src={translateMatrix} style={{maxWidth:"10vw"}} alt="translate matrix"/>
            </section>
            <section className="infoColorsSection">
                <h1>Translation</h1>
                <p>&emsp;Translation involves moving an object from one location to another while maintaining
                    its shape and orientation. In a 2D space, translation is represented by shifting an
                    object horizontally and/or vertically. In a 3D space, translation extends to movement
                    along the x, y, and z axes.</p>
            </section>
        </section>
        <section className="section">
            <section className="infoColorsSection">
                <h1>Scaling</h1>
                <p>&emsp;Scaling involves resizing an object, either expanding or contracting it. In both 2D and
                    3D spaces, scaling is represented by multiplying the coordinates of each point by a scaling
                    factor.</p>
            </section>
            <section className="illustrationSection">
                <h1>Scaling matrix</h1>
                <img src={scalingMatrix} style={{maxWidth:"10vw"}} alt="scaling matrix"/>
            </section>
        </section>
        <section className="section">
            <section className="illustrationSection">
                <h1>Rotation matrix</h1>
                <img src={rotationMatrix} style={{maxWidth:"15vw"}} alt="rotation matrix"/>
            </section>
            <section className="infoColorsSection">
                <h1>Rotation</h1>
                <p>&emsp;Rotation involves turning an object around a point. In 2D, rotation is typically
                    performed around the origin, while in 3D, it occurs around an arbitrary axis.</p>
            </section>
        </section>
        <section className="linksSection">
            <h1 style={{textAlign:"center"}}>
                Useful links
            </h1>
            <ul>
                <li>
                    <p>
                        Additional information about basic affine transformations.<br/>
                        <a href="https://www.mathworks.com/discovery/affine-transformation.html">*click*</a>
                    </p>
                </li>
                <li>
                    <p>
                        Wikipedia article about Affine transformations with lots of information<br/>
                        <a href="https://en.wikipedia.org/wiki/Affine_transformation">*click*</a>
                    </p>
                </li>
                <li>
                    <p>
                        More info about affine transformations with code examples and realisation<br/>
                        <a href="https://medium.com/geekculture/affine-transformations-in-depth-65f7876f3834">*click*</a>
                    </p>
                </li>
            </ul>
        </section>
    </article>
}

export default AffineMaterial;