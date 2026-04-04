import Carousel from "../components/CarouselPodruct";
import { useAuth } from "../context/useAuth";


export default function Services() {
  
  const { user } = useAuth();
  
  return (
    <>
      <section className="container-servicios">
        <h2 className="title-services">Servicios</h2>
        <Carousel />
      </section>
    </>
  );
}