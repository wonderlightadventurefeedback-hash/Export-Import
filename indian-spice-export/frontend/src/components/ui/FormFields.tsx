import React, { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, className, id: customId, ...props }, ref) => {
    const autoId = useId();
    const id = customId || autoId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-charcoal">
            {label}
            {props.required && <span className="text-terracotta ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-charcoal-muted pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "w-full rounded-[2px] border bg-ivory-50 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-muted/60 transition-colors",
              "border-ivory-400 focus-visible:outline-none focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/50",
              error && "border-terracotta focus-visible:ring-terracotta/40",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-charcoal-muted">
            {hint}
          </p>
        )}

        {error && (
          <div id={errorId} className="flex items-center gap-1.5 text-xs text-terracotta mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id: customId, rows = 4, ...props }, ref) => {
    const autoId = useId();
    const id = customId || autoId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-charcoal">
            {label}
            {props.required && <span className="text-terracotta ml-1">*</span>}
          </label>
        )}

        <textarea
          id={id}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-[2px] border bg-ivory-50 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-muted/60 transition-colors",
            "border-ivory-400 focus-visible:outline-none focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/50",
            error && "border-terracotta focus-visible:ring-terracotta/40",
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-charcoal-muted">
            {hint}
          </p>
        )}

        {error && (
          <div id={errorId} className="flex items-center gap-1.5 text-xs text-terracotta mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, className, id: customId, ...props }, ref) => {
    const autoId = useId();
    const id = customId || autoId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-charcoal">
            {label}
            {props.required && <span className="text-terracotta ml-1">*</span>}
          </label>
        )}

        <select
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-[2px] border bg-ivory-50 px-4 py-2.5 text-sm text-charcoal transition-colors",
            "border-ivory-400 focus-visible:outline-none focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/50",
            error && "border-terracotta focus-visible:ring-terracotta/40",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hint && !error && (
          <p id={hintId} className="text-xs text-charcoal-muted">
            {hint}
          </p>
        )}

        {error && (
          <div id={errorId} className="flex items-center gap-1.5 text-xs text-terracotta mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  hint?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, error, className, id: customId, ...props }, ref) => {
    const autoId = useId();
    const id = customId || autoId;

    return (
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className={cn(
              "mt-1 w-4 h-4 rounded-[2px] text-forest-800 border-ivory-400 focus-visible:ring-2 focus-visible:ring-gold-500 accent-forest-800",
              className
            )}
            {...props}
          />
          <span className="text-sm text-charcoal leading-relaxed">{label}</span>
        </label>

        {hint && <p className="text-xs text-charcoal-muted ml-7">{hint}</p>}
        {error && <p className="text-xs text-terracotta ml-7">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
