import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useGenericQuery } from "@/hooks/useGenericQuery"
import { carService } from "@/api/cars.service"
import { useDeleteEntity } from "@/hooks/useDeleteEntity"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { 
    ChevronLeft, Pencil, Calendar, Wrench, Fingerprint, Trash2, 
    Car as CarIcon, Loader2, Gauge, Banknote, CalendarDays 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ServiceHistory } from "@/components/shared/cars/ServiceHistory"

export function CarDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const { data: car, isLoading, isError } = useGenericQuery({
        queryKey: ["car.by-id", id],
        queryFn: () => carService.getCarById(id),
        enabled: !!id,
    })
    
    const { deleteEntity } = useDeleteEntity({
        mutationKey: "deleteCars",
        mutationFn: (id) => carService.deleteCar(id),
        redirectTo: '/i',
        invalidateQueryKey: "cars",
    });

    const MILE_COEFFICIENT = 0.621371;

    if (isLoading) return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    if (isError || !car) return <div className="text-center py-20"><p>Авто не знайдено</p></div>

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="cursor-pointer">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Назад
                </Button>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(`/i/cars/${id}/edit`)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" /> Редагувати
                    </Button>
                    <Button variant="outline" className="text-destructive cursor-pointer" onClick={() => setIsAlertOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Видалити
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* ЛІВА КАРТКА: ОСНОВНИЙ ПРОФІЛЬ */}
            <Card className="md:col-span-1 border-slate-200 shadow-sm flex flex-col justify-between">
                <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <CarIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <h2 className="text-base font-bold text-slate-900 truncate tracking-tight leading-tight">
                            {car.name}
                            </h2>
                        </TooltipTrigger>
                        <TooltipContent><p>{car.name}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono font-bold text-slate-600 tracking-wider">
                        {car.plate || "NO PLATE"}
                    </div>
                    </div>
                </div>

                <div className="mt-6 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Odometer</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                    <span className="text-xl font-mono font-black text-slate-800 tracking-tighter tabular-nums">
                        {car.currentMileage?.toLocaleString()} <span className="text-xs font-sans font-bold text-slate-400 tracking-normal ml-0.5">km</span>
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-500 tabular-nums">
                        {Math.round(car.currentMileage * MILE_COEFFICIENT).toLocaleString()} <span className="text-[10px] font-sans font-medium ml-0.5 text-slate-400">mi</span>
                    </span>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* ПРАВА КАРТКА: ТЕХНІЧНА СПЕЦИФІКАЦІЯ */}
            <Card className="md:col-span-2 border-slate-200 shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5" /> Technical Specification
                </h3>
                </div>
                <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Рік випуску</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-blue-500/70" />
                    <span>{car.year}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">VIN код</p>
                    <div className="flex items-center gap-2">
                    <Fingerprint className="h-3.5 w-3.5 text-purple-500/70" />
                    <span className="font-mono text-[12px] font-bold text-slate-700 tracking-wide uppercase bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {car.vin || "—"}
                    </span>
                    </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Дата придбання</p>
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                    <CalendarDays className="h-3.5 w-3.5 text-green-500/70" />
                    <span>{car.purchaseDate ? format(new Date(car.purchaseDate), "dd MMMM yyyy", { locale: uk }) : "—"}</span>
                    </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Вартість придбання</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Banknote className="h-3.5 w-3.5 text-emerald-500/70" />
                    <span>{car.purchasePrice ? `${Number(car.purchasePrice).toLocaleString()} $` : "—"}</span>
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>
            <div className="mt-8">
                <ServiceHistory 
                    records={car.serviceRecords} // Масив з бази
                    carId={id} 
                />
            </div>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Видалити цей автомобіль?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ви збираєтеся видалити <strong>{car?.name}</strong>. Ця дія видалить також всю історію обслуговування, пов'язану з цим авто.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Скасувати</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
                            onClick={() => {
                                deleteEntity(car.id)
                                setIsAlertOpen(false)
                            }
                        }>
                            Так, видалити
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}