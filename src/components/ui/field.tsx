import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-semibold text-[#33445a]", className)}
      {...props}
    />
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-[#d4dbe5] bg-white px-3 text-sm text-[#263548] outline-none transition focus:border-[#d2664f] focus:ring-2 focus:ring-[#d2664f]/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-[#d4dbe5] bg-white px-3 text-sm font-medium text-[#263548] outline-none transition focus:border-[#d2664f] focus:ring-2 focus:ring-[#d2664f]/20",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full resize-y rounded-md border border-[#d4dbe5] bg-white px-3 py-2 text-sm text-[#263548] outline-none transition focus:border-[#d2664f] focus:ring-2 focus:ring-[#d2664f]/20",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
