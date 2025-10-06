import * as React from 'react'

const Sheet = ({
  children,
  open,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  return <div className={open ? 'block' : 'hidden'}>{children}</div>
}

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props)
  }

  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  )
})
SheetTrigger.displayName = 'SheetTrigger'

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed inset-y-0 right-0 z-50 h-full bg-white shadow-xl overflow-y-auto ${className || ''
      }`}
    {...props}
  >
    <div className="flex h-full flex-col">{children}</div>
  </div>
))
SheetContent.displayName = 'SheetContent'

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-2 text-center sm:text-left p-6 border-b ${className || ''
      }`}
    {...props}
  />
))
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ''
      }`}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
