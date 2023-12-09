import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import FractalPage from "./pages/FractalPage";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/HomePage";
import ColorPage from "./pages/ColorPage";
import AffinePage from "./pages/AfinnePage";
import LearningPage from "./pages/LearningPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<HomePage/>}/>
          <Route path="fractals" element={<FractalPage/>}/>
          <Route path="colors" element={<ColorPage/>}/>
          <Route path="affine" element={<AffinePage/>}/>
          <Route path="learning-material" element={<LearningPage/>}/>
          <Route path="learning-material/:about" element={<LearningPage/>}/>
          <Route path="*" element={<NoPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
