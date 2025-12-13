import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-xl group-[.toaster]:!border-emerald-200/50",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-emerald-600 group-[.toast]:text-white hover:bg-emerald-700",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-800 hover:bg-gray-200",
          success: "!bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !border-emerald-500 !shadow-lg",
          error: "!bg-gradient-to-r !from-red-500 !to-red-600 !text-white !border-red-500 !shadow-lg", 
          warning: "!bg-gradient-to-r !from-yellow-400 !to-orange-500 !text-white !border-yellow-400 !shadow-lg",
          info: "!bg-gradient-to-r !from-blue-500 !to-cyan-500 !text-white !border-blue-500 !shadow-lg",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-white" />,
        info: <InfoIcon className="size-4 text-white" />,
        warning: <TriangleAlertIcon className="size-4 text-white" />,
        error: <OctagonXIcon className="size-4 text-white" />,
        loading: <Loader2Icon className="size-4 animate-spin text-emerald-500" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
