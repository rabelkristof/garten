export default function SecondaryButton(props: { label: string }) {
  return (
    <button className="rounded-full border-2 border-primary bg-background px-10 py-2 text-xl text-primary">
      {props.label}
    </button>
  );
}
