import Login from "../components/Login";
import Register from "../components/Register";


function Home() {
  return (
    <div className="container-home">
      <h1 className="title-1">Bienvenido</h1>
      <article className="container-form">
         <article className="module">
        <Register/>
      </article>
      <article className="module">
        <Login/>
      </article>
      </article>
     
    </div>
  );
}

export default Home;