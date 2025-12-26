import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router"
import * as z from "zod"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { 
    ChevronLeft, Save, Wrench, 
    Banknote, Gauge, CalendarDays, Plus, Trash2 
} from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { serviceRecordService } from "@/api/serviceRecord.service"
import { useCreateMutation } from "@/hooks/useCreateMutation"
import { useUpdateMutation } from "@/hooks/useUpdateMutation"
import { useGenericQuery } from "@/hooks/useGenericQuery"

// Схема валідації
const serviceSchema = z.object({
    date: z.date({ required_error: "Оберіть дату сервісу" }),
    mileage: z.number({ invalid_type_error: "Вкажіть пробіг" }).min(1, "Пробіг має бути більше 0"),
    items: z.array(z.object({
        description: z.string().min(1, "Опис обов'язковий"),
        price: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().min(0))
    })).min(1, "Додайте хоча б одну роботу")
})

export function AddServiceRecordPage({ mode = "create" }) {
    const navigate = useNavigate()
    const { id: carId, recordId } = useParams()
    const [milesValue, setMilesValue] = useState("");
    const KILOMETERS_IN_MILE = 1.60934;

    const form = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            date: new Date(),
            mileage: 0,
            items: [{ description: "", price: "" }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    // 1. Запит даних для редагування
    const { data: serviceRecord, isSuccess, isLoading: isFetchLoading } = useGenericQuery({
        queryKey: ["service-record.by-id", recordId],
        queryFn: () => serviceRecordService.getRecordById(recordId),
        enabled: mode === "edit" && !!recordId,
    });

    // 2. Ініціалізація форми при редагуванні
    useEffect(() => {
        if (mode === "edit" && isSuccess && serviceRecord) {
            form.reset({
                ...serviceRecord,
                date: new Date(serviceRecord.date),
                mileage: Number(serviceRecord.mileage),
                items: serviceRecord.items.map(item => ({
                    description: item.description,
                    price: Number(item.price)
                }))
            });
        }
    }, [isSuccess, serviceRecord, mode, form]);

    // 3. Синхронізація: КМ -> Милі (працює і при вводі, і при завантаженні даних)
    const watchedMileage = form.watch("mileage");
    useEffect(() => {
        if (watchedMileage) {
            setMilesValue(Math.round(watchedMileage / KILOMETERS_IN_MILE).toString());
        } else {
            setMilesValue("");
        }
    }, [watchedMileage]);

    // Обробник зміни миль (рахує в КМ для форми)
    const handleMilesChange = (val) => {
        setMilesValue(val);
        const inKm = val === "" ? 0 : Math.round(Number(val) * KILOMETERS_IN_MILE);
        form.setValue("mileage", inKm, { shouldValidate: true });
    };

    // 4. Мутації
    const { mutate: createRecord, isPending: isCreatePending } = useCreateMutation({
        mutationKey: "service-record.create",
        mutationFn: (payload) => serviceRecordService.createRecord(carId, payload),
        getSuccessMessage: () => `Сервісний запис успішно створено`,
        getRedirectPath: () => `/i/cars/${carId}`,
        queryKeysToInvalidate: ["car.by-id", carId], 
    });

    const { mutate: updateRecord, isPending: isUpdatePending } = useUpdateMutation({
        mutationKey: "service-record.update",
        mutationFn: ({ id, data }) => serviceRecordService.updateRecord(id, data),
        getSuccessMessage: () => `Запис оновлено`,
        getRedirectPath: () => `/i/cars/${carId}`,
        queryKeysToInvalidate: ["car.by-id", carId],
    });

    const onSubmit = async (values) => {
        const payload = {
            ...values,
            date: format(values.date, "yyyy-MM-dd")
        };

        if (mode === "create") {
            createRecord({ data: payload, form });
        } else {
            updateRecord({ id: recordId, data: payload, form });
        }
    }

    const totalAmount = form.watch("items").reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    if (mode === "edit" && isFetchLoading) {
        return <div className="flex justify-center py-20 text-muted-foreground animate-pulse">Завантаження даних...</div>
    }

    return (
        <div className="max-w-3xl mx-auto py-6 px-4">
            <Button variant="ghost" className="mb-4 cursor-pointer" onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Назад
            </Button>

            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b bg-slate-50/50">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>{mode === "create" ? "Новий сервісний запис" : "Редагування запису"}</CardTitle>
                        <p className="text-sm text-muted-foreground">Деталізуйте витрати на обслуговування</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Одометр та Дата */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Gauge className="h-4 w-4" /> Пробіг КМ
                                </label>
                                <Input 
                                    type="number" 
                                    placeholder="0"
                                    {...form.register("mileage", { valueAsNumber: true })}
                                    className={cn(form.formState.errors.mileage && "border-red-300")}
                                />
                                {form.formState.errors.mileage && (
                                    <p className="text-[10px] text-red-500 font-medium uppercase">{form.formState.errors.mileage.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    Пробіг Милі
                                </label>
                                <Input 
                                    type="number" 
                                    placeholder="0"
                                    value={milesValue}
                                    onChange={(e) => handleMilesChange(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" /> Дата
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal cursor-pointer">
                                            {form.watch("date") ? format(form.watch("date"), "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={form.watch("date")}
                                            onSelect={(date) => form.setValue("date", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Список робіт */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Деталі обслуговування
                                </label>
                                <div className="px-3 py-1 bg-primary/10 rounded-full text-sm font-bold text-primary">
                                    Сума: {totalAmount.toLocaleString()} $
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="group relative p-4 border rounded-xl bg-white transition-colors">
                                        <div className="flex gap-4 items-start">
                                            <div className="flex-1 space-y-2">
                                                <Textarea 
                                                    placeholder="Опис роботи (напр. Заміна мастила)" 
                                                    {...form.register(`items.${index}.description`)}
                                                    className={cn(
                                                        "min-h-[80px] resize-none",
                                                        form.formState.errors.items?.[index]?.description && "border-red-500"
                                                    )}
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <div className="relative">
                                                    <Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Ціна" 
                                                        className="pl-9"
                                                        {...form.register(`items.${index}.price`)} 
                                                    />
                                                </div>
                                            </div>
                                            {fields.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => remove(index)}
                                                    className="text-slate-400 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-dashed py-8 border-2 transition-all cursor-pointer"
                                onClick={() => append({ description: "", price: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Додати позицію
                            </Button>
                        </div>

                        {/* Кнопки збереження */}
                        <div className="flex gap-3 pt-6 border-t">
                            <Button 
                                type="submit" 
                                className="flex-1 cursor-pointer"
                                disabled={isCreatePending || isUpdatePending}
                            >
                                <Save className="mr-2 h-4 w-4" /> 
                                {isCreatePending || isUpdatePending ? "Збереження..." : "Зберегти запис"}
                            </Button>
                            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => navigate(-1)}>
                                Скасувати
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}