export default function Heading(props: { text: string }) {
  return (
    <>
      <h1 className="mb-6 mt-12 text-center text-[56px] font-bold text-heading">{props.text}</h1>
      <div className="mx-auto h-2 w-24 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
    </>
  );
}
