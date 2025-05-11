
import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="breadcrumbs" 
      className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}
      dir="rtl"
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index !== 0 && (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
