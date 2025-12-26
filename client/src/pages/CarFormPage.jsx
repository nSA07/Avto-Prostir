import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { carService } from "@/api/cars.service"
import { useCreateMutation } from "@/hooks/useCreateMutation"
import { useUpdateMutation } from "@/hooks/useUpdateMutation"
import { useGenericQuery } from "@/hooks/useGenericQuery"
import { useInitialData } from "@/hooks/useInitialData"
import { format } from "date-fns"
import { uk } from "date-fns/locale"


import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, Save, Car, CalendarIcon, Gauge, Banknote, Calendar as CalendarIcon2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

const carSchema = z.object({
  name: z.string().min(2, "Назва занадто коротка"),
  year: z.preprocess((val) => Number(val), z.number().min(1900).max(2026)),
  plate: z.string().min(3, "Номерний знак обов'язковий"),
  vin: z.string().length(17, "VIN код має бути 17 символів").optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  purchasePrice: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0).optional()),
  currentMileage: z.preprocess((val) => Number(val), z.number().min(0, "Пробіг не може бути меншим за 0")),
})

export function CarFormPage({ mode = "create" }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const KILOMETERS_IN_MILE = 1.60934;

  const { mutate: createCar, isPending: isCreatePending } = useCreateMutation({
    mutationKey: "car.create",
    mutationFn: carService.createCar,
    getSuccessMessage: (data) => `${data.name} було створено`,
    getRedirectPath: (data) => `/i/cars/${data.id}`,
    queryToInvalidate: "cars",
  });
  const { mutate: updateCar, isPending: isUpdatePending } = useUpdateMutation({
    mutationKey: "car.update",
    mutationFn: ({ id, data }) => carService.updateCar(id, data),
    getSuccessMessage: (data) => `${data.name} оновлено`,
    queryKeysToInvalidate: (data) => [
      ["car.by-id", data.id],
      ["cars"]
    ]
  })

  const isPending = isCreatePending || isUpdatePending;
  const form = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: "",
      year: "",
      plate: "",
      vin: "",
      purchaseDate: "",
      purchasePrice: "",
      currentMileage: "",
    },
  })

  const [kmValue, setKmValue] = useState("");
  const [milesValue, setMilesValue] = useState("");

  useEffect(() => {
    const mileage = form.getValues("currentMileage");
    if (mileage) {
      setKmValue(mileage);
      setMilesValue(Math.round(mileage / KILOMETERS_IN_MILE));
    }
  }, [form.watch("currentMileage")]);

  const handleKmChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setKmValue(num);
    setMilesValue(num === "" ? "" : Math.round(num / KILOMETERS_IN_MILE));
    form.setValue("currentMileage", num); // Завжди КМ в основну форму
  };

  const handleMilesChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setMilesValue(num);
    const inKm = num === "" ? "" : Math.round(num * KILOMETERS_IN_MILE);
    setKmValue(inKm);
    form.setValue("currentMileage", inKm); // Переводимо і зберігаємо в КМ
  };

  if (mode === "edit") {  
    const { data: car, isSuccess } = useGenericQuery({
      queryKey: ["car.by-id", id],
      queryFn: () => carService.getCarById(id),
      enabled: !!id,
    }) 
    useInitialData(form.reset, car, { isSuccess })
  }

  const onSubmit = async (values) => {
    const dataToSend = {
      ...values,
      plate: values.plate?.replace(/\s+/g, '').toUpperCase()
    };
    if (mode === "create") {          
      createCar({ data: dataToSend, form })
    } else if (mode === "edit" && id) {
      updateCar({ id, data: dataToSend, form })
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-6">
      <Button variant="ghost" className="mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>
                {mode === "edit" ? "Редагувати автомобіль" : "Додати новий автомобіль"}
              </CardTitle>
              <CardDescription>
                Заповніть дані для точного відстеження сервісної історії
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* Основна інформація */}
              <Field>
                <FieldLabel>Марка та модель</FieldLabel>
                <Input placeholder="Напр: VW Passat B8" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Рік випуску</FieldLabel>
                  <Input type="number" placeholder="2018" {...form.register("year")} />
                </Field>
                <Field>
                  <FieldLabel>Держ. номер</FieldLabel>
                  <Input placeholder="AA0000BB" {...form.register("plate")} />
                </Field>
              </div>

              <Field>
                <FieldLabel>VIN код (17 символів)</FieldLabel>
                <Input placeholder="WVWZZZ..." {...form.register("vin")} />
                {form.formState.errors.vin && (
                  <p className="text-sm text-destructive">{form.formState.errors.vin.message}</p>
                )}
              </Field>

              <hr className="my-4 border-muted" />
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                 <Gauge className="h-4 w-4" /> Поточний стан та придбання
              </h3>

              <Field>
                <FieldLabel>Поточний пробіг</FieldLabel>
                <div className="grid grid-cols-2 gap-4">
                  {/* Інпут для Кілометрів */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="Кілометри"
                        value={kmValue}
                        onChange={(e) => handleKmChange(e.target.value)}
                        disabled={mode === "edit"}
                        className={mode === "edit" ? "bg-muted pr-10" : "pr-10"}
                      />
                      <span className="absolute right-3 top-2 text-xs text-muted-foreground">км</span>
                    </div>
                  </div>

                  {/* Інпут для Миль */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="Милі" 
                        value={milesValue}
                        onChange={(e) => handleMilesChange(e.target.value)}
                        disabled={mode === "edit"}
                        className={mode === "edit" ? "bg-muted pr-10" : "pr-10"}
                      />
                      <span className="absolute right-3 top-2 text-xs text-muted-foreground">mi</span>
                    </div>
                  </div>
                </div>
                
                {/* Приховане поле для валідації Zod, якщо потрібно, щоб воно було в реєстрі форми */}
                <input type="hidden" {...form.register("currentMileage")} />
                
                {form.formState.errors.currentMileage && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.currentMileage.message}
                  </p>
                )}
                {mode === "edit" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Для оновлення пробігу додайте новий сервісний запис
                  </p>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" /> Дата придбання
                  </FieldLabel>
                  
                  <Controller
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: uk })
                            ) : (
                              <span>Оберіть дату</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Banknote className="h-3 w-3" /> Ціна придбання
                  </FieldLabel>
                  <Input 
                    type="number" 
                    placeholder="15000" 
                    {...form.register("purchasePrice")} 
                  />
                </Field>
              </div>
            </FieldGroup>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 cursor-pointer" disabled={isPending}>
                {isPending ? "Збереження..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "edit" ? "Зберегти зміни" : "Створити картку авто"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => navigate("/i")}>
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}