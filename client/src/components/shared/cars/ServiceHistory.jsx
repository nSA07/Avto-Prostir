import React, { useState } from "react"
import { Link, useNavigate } from "react-router"
import { 
    Plus, Wrench, Calendar, 
    Gauge, Trash2, Edit2, MoreHorizontal,
    ArrowRight, Banknote
} from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { serviceRecordService } from "@/api/serviceRecord.service"
import { useDeleteEntity } from "@/hooks/useDeleteEntity"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export function ServiceHistory({ records = [], carId }) {
    const navigate = useNavigate()
    const [recordToDelete, setRecordToDelete] = useState(null);
    const KILOMETERS_IN_MILE = 1.60934;

    const { deleteEntity } = useDeleteEntity({
        mutationKey: "service-record.delete",
        mutationFn: (id) => serviceRecordService.deleteRecord(id),
        getSuccessMessage: () => "Запис видалено",
        invalidateQueryKey: ["car.by-id", carId]
    });

    if (records.length === 0) {
        return (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center py-16 px-4">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Wrench className="h-6 w-6 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Журнал обслуговування порожній</h3>
                <p className="text-sm text-slate-500 mb-6 text-center max-w-[280px]">
                    Додайте перший запис, щоб почати відстежувати витрати та історію авто.
                </p>
                <Button className="rounded-full px-6 shadow-md" asChild>
                    <Link to={`/i/cars/${carId}/service-records/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Додати запис
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 uppercase flex items-center gap-2">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse" />
                        Технічний журнал
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                        Total entries: {records.length}
                    </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-slate-300 hover:bg-slate-100" asChild>
                    <Link to={`/i/cars/${carId}/service-records/new`}>
                        <Plus className="mr-1.5 h-3.5 w-3.5" /> Новий запис
                    </Link>
                </Button>
            </div>

            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                {records.map((record) => {
                    const total = record.items?.reduce((sum, item) => sum + Number(item.price || 0), 0);
                    const miles = Math.round(record.mileage / KILOMETERS_IN_MILE);
                    
                    return (
                        <div key={record.id} className="relative pl-12 group">
                            {/* Крапка на таймлайні */}
                            <div className="absolute left-0 mt-1.5 h-10 w-10 flex items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm z-10">
                                <Calendar className="h-4 w-4" />
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
                                {/* Header: Мета-дані */}
                                <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <div className="text-sm font-bold text-slate-900">
                                            {format(new Date(record.date), "dd MMMM yyyy", { locale: uk })}
                                        </div>
                                        <div className="flex items-center gap-1.5 py-0.5 px-2 bg-white border border-slate-200 rounded-md shadow-sm">
                                            <Gauge className="h-3 w-3 text-indigo-500" />
                                            <span className="text-[12px] font-mono font-bold text-slate-700">
                                                {record.mileage.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans uppercase">KM</span>
                                            </span>
                                            <ArrowRight className="h-3 w-3 text-slate-300" />
                                            <span className="text-[12px] font-mono font-bold text-slate-500">
                                                {miles.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans uppercase">MI</span>
                                            </span>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white cursor-pointer transition-colors">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => navigate(`/i/cars/${carId}/service-records/${record.id}/edit`)} className="cursor-pointer">
                                                <Edit2 className="mr-2 h-4 w-4" /> Редагувати
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setRecordToDelete(record.id)} className="text-destructive focus:text-destructive cursor-pointer">
                                                <Trash2 className="mr-2 h-4 w-4" /> Видалити
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Body: Перелік робіт */}
                                <div className="p-4">
                                    <table className="w-full text-[13px]">
                                        <thead>
                                            <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                                                <th className="text-left font-bold pb-2">Опис технічних робіт</th>
                                                <th className="text-right font-bold pb-2">Вартість</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {record.items?.map((item, idx) => (
                                                <tr key={idx} className="group/row">
                                                    <td className="py-2 pr-4 text-slate-600 font-medium italic leading-relaxed">
                                                        {item.description}
                                                    </td>
                                                    <td className="py-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                                                        ${Number(item.price).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer: Разом */}
                                <div className="px-4 py-2 bg-indigo-50/30 flex justify-between items-center border-t border-indigo-50">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-400 tracking-tighter">
                                        <Banknote className="h-3.5 w-3.5" /> Total Expenditures
                                    </div>
                                    <div className="text-md font-black text-indigo-700 font-mono tracking-tight">
                                        ${total.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Видалити запис?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ця дія призведе до видалення технічного запису про обслуговування з бази даних.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">Скасувати</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6"
                            onClick={() => {
                                deleteEntity(recordToDelete);
                                setRecordToDelete(null);
                            }}
                        >
                            Так, видалити
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}