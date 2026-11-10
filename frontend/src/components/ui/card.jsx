import * as React from "react"
import { cn } from "cn"

function Card({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-lg border bg-card text-card-foreground",
        className
      )}
      {...props} />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn("p-5 pb-2", className)}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-semibold tracking-tight", className)}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <p
      data-slot="card-description"
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props} />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (<div data-slot="card-content" className={cn("p-5 pt-3", className)} {...props} />);
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-5 pt-0", className)}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
