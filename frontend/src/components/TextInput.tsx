export default function TextInput(props: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      className="rounded-full border-2 border-muted px-8 py-4 text-2xl focus:border-primary focus:outline-none"
    />
  );
}
