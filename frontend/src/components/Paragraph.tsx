export default function Paragraph(props: { text: string }) {
  return (
    <>
      <div className="w-full">
        <p className="mx-auto mt-16 w-[65%] text-justify text-2xl">{props.text}</p>
      </div>
    </>
  );
}
