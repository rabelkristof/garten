import NavBar from "../NavBar.tsx";
import Banner from "../Banner.tsx";
import Heading from "../Heading.tsx";
import Paragraph from "../Paragraph.tsx";

export default function Home() {
  return (
    <>
      <NavBar />
      <Banner text="Experience Perfection." />
      <Heading text="Why Garten?" />
      <Paragraph text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, dignissimos esse deserunt accusantium inventore hic est vitae natus provident quis corporis quas delectus saepe harum beatae sint odio at vero alias eum, quibusdam cum quidem? Consequatur minima labore quis quo harum unde dolorem et? Autem magni a consequuntur quaerat perspiciatis iusto soluta magnam blanditiis quia voluptatibus. Nobis necessitatibus eaque unde quasi explicabo eos delectus itaque ipsum, tenetur dolorem, corrupti similique esse, cupiditate amet iure porro!" />
    </>
  );
}
