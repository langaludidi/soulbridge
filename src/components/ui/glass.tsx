/**
 * Liquid Glass UI Components
 * iOS 26 "Liquid Glass" Design Philosophy
 *
 * Features:
 * - Frosted glass morphism effects
 * - Dynamic blur and transparency
 * - Smooth animations and transitions
 * - Elevation-based depth hierarchy
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// ═══════════════════════════════════════════════════════════════
// GLASS CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const glassCardVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        light: [
          "bg-glass-light",
          "border border-glass",
          "shadow-glass-inset",
        ],
        dark: [
          "bg-glass-dark",
          "border border-glass-dark",
          "shadow-glass-inset-dark",
        ],
        ultralight: [
          "bg-glass-ultralight",
          "border border-glass-subtle",
        ],
        ultradark: [
          "bg-glass-ultradark",
          "border border-glass-subtle",
        ],
      },
      blur: {
        sm: "backdrop-blur-glass-sm",
        md: "backdrop-blur-glass-md",
        lg: "backdrop-blur-glass-lg",
        xl: "backdrop-blur-glass-xl",
      },
      elevation: {
        low: "shadow-glass-sm",
        medium: "shadow-glass-md hover:shadow-glass-lg",
        high: "shadow-glass-lg hover:shadow-glass-xl",
        ultra: "shadow-glass-xl",
      },
      rounded: {
        default: "rounded-glass",
        lg: "rounded-glass-lg",
        full: "rounded-full",
      },
      interactive: {
        true: "hover:scale-[1.02] hover:shadow-glass-xl active:scale-[0.98] cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "light",
      blur: "md",
      elevation: "medium",
      rounded: "default",
      interactive: false,
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  glow?: boolean;
  shimmer?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant,
      blur,
      elevation,
      rounded,
      interactive,
      glow = false,
      shimmer = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, blur, elevation, rounded, interactive }),
          glow && "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
          shimmer && "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

// ═══════════════════════════════════════════════════════════════
// GLASS BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        glass: [
          "bg-glass-light",
          "border border-glass",
          "shadow-glass-sm shadow-glass-inset",
          "backdrop-blur-glass-md",
          "hover:bg-glass-light/90 hover:shadow-glass-md",
          "active:scale-95",
        ],
        "glass-dark": [
          "bg-glass-dark",
          "border border-glass-dark",
          "shadow-glass-sm shadow-glass-inset-dark",
          "backdrop-blur-glass-md",
          "text-white",
          "hover:bg-glass-dark/90 hover:shadow-glass-md",
          "active:scale-95",
        ],
        "glass-accent": [
          "bg-gradient-to-br from-accent/80 to-accent/60",
          "border border-white/40",
          "shadow-glass-md shadow-glass-inset",
          "backdrop-blur-glass-lg",
          "text-white font-semibold",
          "hover:from-accent/90 hover:to-accent/70 hover:shadow-glass-lg",
          "active:scale-95",
        ],
        "glass-ghost": [
          "border border-glass-subtle",
          "backdrop-blur-glass-sm",
          "hover:bg-glass-ultralight hover:border-glass",
          "active:scale-95",
        ],
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-glass",
        md: "h-11 px-6 text-base rounded-glass",
        lg: "h-14 px-8 text-lg rounded-glass-lg",
        icon: "h-11 w-11 rounded-glass",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "md",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

// ═══════════════════════════════════════════════════════════════
// GLASS MODAL/DIALOG COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface GlassModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  blur?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
}

const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  (
    {
      className,
      open = false,
      onClose,
      blur = "xl",
      variant = "light",
      children,
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Glass Backdrop */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            blur === "sm" && "backdrop-blur-glass-sm",
            blur === "md" && "backdrop-blur-glass-md",
            blur === "lg" && "backdrop-blur-glass-lg",
            blur === "xl" && "backdrop-blur-glass-xl",
            variant === "light" && "bg-black/20",
            variant === "dark" && "bg-black/40"
          )}
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-10 w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
            variant === "light" && "bg-glass-light border-glass shadow-glass-inset",
            variant === "dark" && "bg-glass-dark border-glass-dark shadow-glass-inset-dark",
            "border backdrop-blur-glass-lg rounded-glass-lg shadow-glass-xl",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
GlassModal.displayName = "GlassModal";

// ═══════════════════════════════════════════════════════════════
// GLASS NAVIGATION BAR COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface GlassNavBarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "light" | "dark";
  position?: "fixed" | "sticky" | "relative";
  blur?: "sm" | "md" | "lg" | "xl";
}

const GlassNavBar = React.forwardRef<HTMLElement, GlassNavBarProps>(
  (
    {
      className,
      variant = "light",
      position = "sticky",
      blur = "lg",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "top-0 z-40 w-full transition-all duration-300",
          position === "fixed" && "fixed",
          position === "sticky" && "sticky",
          position === "relative" && "relative",
          variant === "light" && "bg-glass-light border-glass shadow-glass-inset",
          variant === "dark" && "bg-glass-dark border-glass-dark shadow-glass-inset-dark",
          blur === "sm" && "backdrop-blur-glass-sm",
          blur === "md" && "backdrop-blur-glass-md",
          blur === "lg" && "backdrop-blur-glass-lg",
          blur === "xl" && "backdrop-blur-glass-xl",
          "border-b shadow-glass-sm",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
GlassNavBar.displayName = "GlassNavBar";

// ═══════════════════════════════════════════════════════════════
// GLASS PANEL COMPONENT (For Sidebars, Drawers, etc.)
// ═══════════════════════════════════════════════════════════════

const glassPanelVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        light: [
          "bg-glass-light",
          "border-glass",
          "shadow-glass-inset",
        ],
        dark: [
          "bg-glass-dark",
          "border-glass-dark",
          "shadow-glass-inset-dark",
        ],
      },
      blur: {
        sm: "backdrop-blur-glass-sm",
        md: "backdrop-blur-glass-md",
        lg: "backdrop-blur-glass-lg",
        xl: "backdrop-blur-glass-xl",
      },
      side: {
        left: "border-r",
        right: "border-l",
        top: "border-b",
        bottom: "border-t",
      },
      elevation: {
        none: "",
        low: "shadow-glass-sm",
        medium: "shadow-glass-md",
        high: "shadow-glass-lg",
      },
    },
    defaultVariants: {
      variant: "light",
      blur: "lg",
      side: "left",
      elevation: "medium",
    },
  }
);

export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      variant,
      blur,
      side,
      elevation,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassPanelVariants({ variant, blur, side, elevation }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

// ═══════════════════════════════════════════════════════════════
// GLASS INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "dark";
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant = "light", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-glass px-4 py-3 text-base transition-all duration-200",
          "backdrop-blur-glass-md",
          "focus:outline-none focus:ring-2 focus:ring-accent/50",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variant === "light" && [
            "bg-glass-ultralight",
            "border border-glass",
            "shadow-glass-sm shadow-glass-inset",
            "hover:bg-glass-light focus:bg-glass-light",
          ],
          variant === "dark" && [
            "bg-glass-ultradark",
            "border border-glass-dark",
            "shadow-glass-sm shadow-glass-inset-dark",
            "text-white",
            "hover:bg-glass-dark focus:bg-glass-dark",
          ],
          className
        )}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export {
  GlassCard,
  GlassButton,
  GlassModal,
  GlassNavBar,
  GlassPanel,
  GlassInput,
  glassCardVariants,
  glassButtonVariants,
  glassPanelVariants,
};
