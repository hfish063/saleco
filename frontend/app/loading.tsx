import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-row gap-4 w-full py-16 px-16 justify-center items-center">
      <Spinner className="size-12" />
      <p>Loading</p>
    </div>
  );
}
