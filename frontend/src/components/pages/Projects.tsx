import NavBar from "../NavBar.tsx";
import ProjectCard from "../ProjectCard.tsx";

export default function Projects() {
  return (
    <div className="bg-gray h-screen">
      <div>
        <NavBar />
      </div>
      <div className="mt-[25vh] flex justify-center">
        <ProjectCard text="+" />
        <ProjectCard text="..." />
        <ProjectCard text="..." />
        <ProjectCard text="..." />
      </div>
    </div>
  );
}
