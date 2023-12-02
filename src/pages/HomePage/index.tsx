import {Navigate} from "react-router-dom";

function HomePage(){
    return <>
        <h1>Home page</h1>
        <Navigate to="fractals"/>
    </>
}

export default HomePage;