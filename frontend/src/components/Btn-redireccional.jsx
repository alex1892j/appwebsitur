import { useNavigate } from "react-router-dom";


function BtnRedireccional() {

  const navigate = useNavigate();

  const handlerRedirect = async (e) =>{

    e.preventDefault();

    navigate("/Infocortes");
  };

  return( 
        
        <>
            <button onClick={handlerRedirect}>
                ver cortes
            </button>
        </>
    )
}

export default BtnRedireccional;