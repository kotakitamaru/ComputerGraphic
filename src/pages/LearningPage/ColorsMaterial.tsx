import "./ColorsMaterial.css"
import hsvGif from "../../assets/videos/hsv.gif"
import cmykImg from "../../assets/images/CMYK.png"

function ColorsMaterial(){
    return <article className="colorsArticle">
        <section className="section">
            <section className="infoColorsSection">
                <h1>HSV color model</h1>
                <p>
                    &emsp;The HSV (Hue, Saturation, Value) color model is a concise and intuitive representation of colors,
                    widely used in design and digital imaging.
                </p>
                <p>
                    <b>Hue</b>: This denotes the color itself, measured in degrees on a color wheel (0 to 360). It defines
                    whether a color is red, green, blue, etc.
                </p>
                <p>
                    <b>Saturation</b>: Represented as a percentage, it indicates the vividness of a color. Higher values
                    result in more vibrant colors, while lower values move towards grayscale.
                </p>
                <p>
                    <b>Value</b>: This component determines the brightness of a color, ranging from 0% (black) to 100%
                    (fully illuminated color).
                </p>
            </section>
            <section className="illustrationSection">
                HSV color model illustration
                <img src={hsvGif}/>
            </section>
        </section>
        <section className="section">
            <section className="infoColorsSection">
                CMYK color model illustration
                <img src={cmykImg} alt="CMYK"/>
            </section>
            <section className="illustrationSection">
                <h1> CMYK color model</h1>
                <p>
                    &emsp;The CMYK color model, standing for Cyan, Magenta, Yellow, and Key (black), is a fundamental
                    system used in color printing and reproduction.
                </p>
                <p>
                    <b>Cyan, Magenta, Yellow</b>: The primary colors in the CMYK model, these represent the subtractive
                    color process. By combining these inks, a wide spectrum of colors can be produced. For example,
                    mixing cyan and yellow creates green.
                </p>
                <p>
                    <b>Key (Black)</b>: Added to enhance contrast and detail, the black component in CMYK is crucial for
                    achieving true black tones in prints.
                </p>
            </section>
        </section>
        <section className="linksSection">
            <h1 style={{textAlign:"center"}}>
                Useful links
            </h1>
            <ul>
                <li>
                    <p>
                        Good explanation about HSV with 3D illustration, color picker and comparisons.<br/>
                        <a href="https://web.cs.uni-paderborn.de/cgvb/colormaster/web/color-systems/hsv.html">*click*</a>
                    </p>
                </li>
                <li>
                    <p>
                        Interesting information about using of CMYK and why it was created<br/>
                        <a href="https://redsunpress.com/printing-processes/">*click*</a>
                    </p>
                </li>
                <li>
                    <p>
                        Information about CMYK as color models with examples of colors in that model<br/>
                        <a href="https://mixam.co.uk/support/cmykchart">*click*</a>
                    </p>
                </li>
                <li>
                    <p>
                        Video with explanation about HSV color model<br/>
                        <a href="https://www.youtube.com/watch?v=gv9iEmGaE6Y&pp=ygUPaHN2IGNvbG9yIG1vZGVs">*click*</a>
                    </p>
                </li>

            </ul>
        </section>
    </article>
}

export default ColorsMaterial;