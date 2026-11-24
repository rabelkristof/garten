import NavBar from "../NavBar.tsx";
import ProjectCard from "../ProjectCard.tsx";

export default function Projects() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <ProjectCard text="+" />
      </div>
    </>
  );
}
