export default function ProjectCard(props: { text: string }) {
  return (
    <div className="m-4 h-48 w-72 rounded-3xl border-4 border-primary bg-background px-9 py-12 text-center text-[56px] text-primary">
      <p>{props.text}</p>
    </div>
  );
}
