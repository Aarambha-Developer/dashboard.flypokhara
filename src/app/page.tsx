import Login from "@/components/login";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl  flex flex-col justify-center items-center space-y-4 mt-40">
      <div>Welcome to the system please login</div>
      <Login />
    </div>
  );
}
