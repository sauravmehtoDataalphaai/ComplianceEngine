import { forwardRef, useImperativeHandle, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Code } from "lucide-react";

interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isValid?: boolean;
  onValidate?: () => void;
}

export interface ExpressionEditorRef {
  insertAtCursor: (text: string) => void;
}

const ExpressionEditor = forwardRef<ExpressionEditorRef, ExpressionEditorProps>(
  ({ value, onChange, error, isValid, onValidate }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + text + value.substring(end);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
      }
    }));

    return (
      <Card data-testid="expression-editor">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Code className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              Rule Expression
            </CardTitle>
            <div className="flex items-center gap-2">
              {isValid !== undefined && (
                <span className={`text-sm flex items-center gap-1 ${isValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Valid syntax
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Invalid syntax
                    </>
                  )}
                </span>
              )}
              <Button 
                type="button"
                variant="secondary" 
                size="sm" 
                onClick={onValidate}
                data-testid="validate-expression"
              >
                Validate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your rule expression here...&#10;&#10;Examples:&#10;EXPOSURE(sector='Tech') / NAV() <= 0.10&#10;SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15&#10;VaR(Fund) <= VaR(Benchmark) * 1.5"
            className="font-mono text-sm min-h-[160px] resize-none"
            data-testid="expression-textarea"
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

ExpressionEditor.displayName = "ExpressionEditor";

export default ExpressionEditor;
