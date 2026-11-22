export default function Banner(props: { text: string }) {
  return (
    <div className="flex h-96 w-full items-center bg-gradient-to-r from-primary to-secondary">
      <p className="mx-auto text-[72px] font-bold text-background">{props.text}</p>
    </div>
  );
}
