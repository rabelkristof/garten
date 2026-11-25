import ProfileButton from "./ProfileButton.tsx";
import SecondaryButton from "./SecondaryButton.tsx";
import PrimaryButton from "./PrimaryButton.tsx";

export default function NavBar() {
  return (
    <nav className="flex w-full bg-background px-4 py-3">
      <div className="mr-auto">
        <ProfileButton />
      </div>
      <div className="flex w-[19rem] justify-between text-right">
        <SecondaryButton label="Log In" />
        <PrimaryButton label="Sign Up" />
      </div>
    </nav>
  );
}
