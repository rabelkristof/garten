import Heading from "../Heading.tsx";
import TextInput from "../TextInput.tsx";
import TextLabel from "../TextLabel.tsx";
import PrimaryButtonLarge from "../PrimaryButtonLarge.tsx";

export default function LogIn() {
  return (
    <>
      <Heading text="Log In" />
      <div className="mx-auto mb-8 mt-16 text-center">
        <TextLabel text="E-mail" />
        <TextInput placeholder="Enter your email" />
      </div>
      <div className="mx-auto mb-16 mt-16 text-center">
        <TextLabel text="Password" />
        <TextInput placeholder="Enter your password" />
      </div>
      <div className="text-center">
        <PrimaryButtonLarge label="Log In" />
      </div>
    </>
  );
}
