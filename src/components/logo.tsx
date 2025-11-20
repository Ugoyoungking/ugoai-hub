import { cn } from "@/lib/utils";
import * as React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      {...props}
    >
      <path d="M15.5 2.5a1.5 1.5 0 0 0-3 0V6a1.5 1.5 0 0 0 3 0V2.5z" />
      <path d="M8.5 2.5a1.5 1.5 0 0 1 3 0V6a1.5 1.5 0 0 1-3 0V2.5z" />
      <path d="M12 18H5.25a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v8.25A2.25 2.25 0 0 1 18.75 18H12z" />
      <path d="M12 18v3" />
      <path d="M10.5 21h3" />
    </svg>
  );
}
