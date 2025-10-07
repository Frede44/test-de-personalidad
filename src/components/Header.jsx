import { Link,Links } from "react-router-dom"
import Question from "./Question"
export default function Header() {
   return( 
   <>
        <h1>¿Cual elemento eres tu?</h1>
        <p>(completa el cuestionario para saber)</p>

       <nav>
         <Link to="/">Inicio</Link>
        <Link to="/Quiz" >Cuestionario</Link>
       </nav>
    </>
    )
}