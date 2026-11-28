import Heading from "../Heading.tsx";
import TextInput from "../TextInput.tsx";
import TextLabel from "../TextLabel.tsx";
import PasswordInput from "../PasswordInput.tsx";
import PrimaryButtonLarge from "../PrimaryButtonLarge.tsx";

export default function Register() {
  return (
    <>
      <Heading text="Sign Up" />
      <div className="mx-auto mb-8 mt-16 text-center">
        <TextLabel text="Username" />
        <TextInput placeholder="Enter your username" />
      </div>
      <div className="mx-auto mb-8 mt-16 text-center">
        <TextLabel text="E-mail" />
        <TextInput placeholder="janos@citromail.hu" />
      </div>
      <div className="mx-auto mb-16 mt-16 justify-between text-center">
        <TextLabel text="Password" />
        <PasswordInput placeholder="Enter your password" />
      </div>
      <div className="mx-auto mb-16 mt-16 justify-between text-center">
        <TextLabel text="Verify Password" />
        <PasswordInput placeholder="Re-enter your password" />
      </div>
      <div className="text-center">
        <PrimaryButtonLarge label="Log In" />
      </div>
    </>
  );
}
