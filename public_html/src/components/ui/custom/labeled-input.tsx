"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideEyeOff, LucideEye } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, labelClassName, ...props }, ref) => {
    const [hidden, setHidden] = React.useState(type === "password");
    const [vale, setVal] = React.useState<any>();
    const [isFocus, setIsFocus] = React.useState(false);

    const handleBlur = () => {
      setIsFocus(vale?.length > 0 ? true : false); // Set focus based on value length
    };
    return (
      <div className="relative flex items-center">
        {label && !props.placeholder && (
          <label
            className={cn(
              `absolute top-[30%] left-4 text-sm ease-in-out duration-150 bg-secondary rounded-md  ${
                isFocus && "-mt-6 -ml-2 px-2 text-xs"
              }`,
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <input
          onBlur={handleBlur}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => setVal(e.target.value)}
          type={hidden ? "password" : "text"}
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-transparent pl-3 pr-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            onClick={() => setHidden(!hidden)}
            type="button"
            className="absolute right-0 mr-2 hover:bg-muted p-2 rounded-full grid place-content-center"
          >
            {hidden ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "PasswordInput";

export { Input };
