import { AuthForm } from "@/components/shared/auth-form"
import { Link } from "react-router"
import { ChevronLeft, Car } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-slate-50/50">
      <div className="w-full max-w-sm">
        {/* Посилання на головну */}
        <div className="mb-6 flex justify-between items-center px-1">
          <Link 
            to="/" 
            className="group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            На головну
          </Link>
          
          <div className="flex items-center gap-1.5 opacity-50">
            <Car className="h-4 w-4 text-slate-900" />
            <span className="text-xs font-black tracking-tighter text-slate-900">
              AVTO<span className="text-indigo-600">PROSTIR</span>
            </span>
          </div>
        </div>

        <AuthForm mode="register" />
      </div>
    </div>
  )
}