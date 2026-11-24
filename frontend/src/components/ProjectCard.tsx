export default function ProjectCard(props: { text: string }) {
  return (
    <div className="rounded-full border-2 border-primary px-9 py-12 text-center text-[56px] text-primary">
      <p>{props.text}</p>
    </div>
  );
}
