import algebraicFractalsVideo from "../../assets/videos/algebraic_fractals.mp4"
import "./FractalMaterial.css";
import vicsekGif from "../../assets/videos/Vicsek_Fractal_Gif.gif"
function FractalMaterial() {
    return <article className="fractalArticle">
        <section className="infoSection">
            <section className="textSection">
                <h1>Mandelbrot Fractal</h1>
                <p> &emsp;The Mandelbrot set is a visually stunning mathematical
                    fractal created by iterating the formula z=z*z+c on complex numbers c.
                    The set comprises points where the sequence remains bounded. This results
                    in intricate, self-replicating patterns. Visualization involves iterating
                    for each pixel in the complex plane, with coloring determined by the escape
                    behavior. The Mandelbrot set has become an iconic representation of the aesthetic
                    beauty inherent in mathematical structures.</p>
                <p></p>
                <h1>Julia Fractal</h1>
                <p>&emsp;Closely related to the Mandelbrot set, the Julia fractal is generated using
                    the same formula z=z*z+c, but with a fixed c. Varying the complex number z produces
                    unique Julia sets, and changing the constant c introduces a diverse array of intricate
                    patterns. Julia sets are often displayed in conjunction with the Mandelbrot set, where
                    each point in the Mandelbrot set corresponds to a different Julia set.</p>
                <h1>Vicsek Fractal</h1>
                <p>&emsp;The Vicsek fractal is a geometric fractal named after its creator Tamás Vicsek.
                    Unlike the Mandelbrot and Julia sets, the Vicsek fractal is not based on complex numbers
                    or iterative equations. Instead, it originates from a deterministic algorithm applied to
                    a grid of squares.<br/>
                    &emsp;The construction of a Vicsek fractal involves dividing a square into smaller squares and
                    removing a central square from each. The process is then iteratively applied to the remaining
                    squares. The recursive nature of this algorithm leads to the emergence of a self-replicating,
                    geometric pattern reminiscent of a snowflake.</p>
            </section>
            <section>
                <section className="videoDiv">
                    Mandelbrot and Julia fractals explanation
                    <video className="algebraicVideo" controls>
                        <source src={algebraicFractalsVideo} type="video/mp4"></source>
                    </video>
                </section>
                <section className="videoDiv">
                    Vicsek creation illustration
                    <img src={vicsekGif} alt="Vicsek creation illustration"/>
                </section>
            </section>
        </section>
        <section className="linksSection">
            <h1 style={{textAlign:"center"}}>Useful links</h1>
            <ul>
                <li>
                    <p>Mandelbrot set explanation and building with code example<br/>
                        <a href="https://math.libretexts.org/Bookshelves/Analysis/Complex_Analysis_-_A_Visual_and_Interactive_Introduction_(Ponce_Campuzano)/05%3A_Chapter_5/5.05%3A_The_Mandelbrot_Set">*click*</a>
                    </p>
                </li>
                <li>
                    <p>Julia set explanation and building with code example<br/>
                        <a href="https://math.libretexts.org/Bookshelves/Analysis/Complex_Analysis_-_A_Visual_and_Interactive_Introduction_(Ponce_Campuzano)/05%3A_Chapter_5/5.06%3A_The_Julia_Set">*click*</a>
                    </p>
                </li>
                <li>
                    <p>Vicsek fractal explanation and construction with different variants<br/>
                        <a href="https://en.wikipedia.org/wiki/Vicsek_fractal">*click*</a>
                    </p>
                </li>
            </ul>
        </section>
    </article>
}

export default FractalMaterial;