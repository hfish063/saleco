import { Separator } from "../ui/separator";

export default function AppHeader() {
  return (
    <div className="bg-black text-white">
      <div className="flex flex-row gap-4 items-center justify-center p-4">
        <h3 className="text-2xl font-bold">COMP 420 SaleCo</h3>
        <p className="text-muted-foreground">author: Hayden Fish</p>
      </div>
      <Separator />
    </div>
  );
}
