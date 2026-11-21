export default function PrimaryButton(props: { label: string }) {
  return (
    <button className="rounded-full bg-gradient-to-r from-primary to-secondary px-10 py-[0.6rem] text-xl text-background">
      {props.label}
    </button>
  );
}
