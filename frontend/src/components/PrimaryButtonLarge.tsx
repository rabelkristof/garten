export default function PrimaryButtonLarge(props: { label: string }) {
  return (
    <button className="rounded-full bg-gradient-to-r from-primary to-secondary px-14 py-[0.8rem] text-2xl text-background">
      {props.label}
    </button>
  );
}
