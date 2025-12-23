"use client";
import FunctionsLibrary from "@/components/FunctionsLibrary";
import { useToast } from "@/hooks/use-toast";

export default function FunctionsPage() {
  const { toast } = useToast();

  const handleInsertFunction = (syntax: string) => {
    navigator.clipboard.writeText(syntax);
    toast({
      title: "Function Copied",
      description: `"${syntax}" has been copied to clipboard.`,
    });
  };

  return (
    <div className="p-3 sm:p-4 h-full flex flex-col" data-testid="functions-page">
      <div className="mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-xl font-semibold">Functions Library</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Browse available functions for building compliance rules
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <FunctionsLibrary onInsertFunction={handleInsertFunction} />
      </div>
    </div>
  );
}
