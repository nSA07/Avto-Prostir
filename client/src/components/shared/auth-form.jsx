import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CONFIG } from "./auth-form.config"
import { useAuthStore } from "@/auth/auth.store";
 
const formSchema = z.object({
    email: z.string().email("Невірний формат пошти"),
    password: z.string().min(6).max(16),
})

export function AuthForm({
    mode = 'login',
    className,
    ...props
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const config = CONFIG[mode]
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    
    async function onSubmit(values) {
        
        try {
            setLoading(true)

            const data = await config.onSubmit(values)
            
            if (data?.token) {
                useAuthStore.getState().setToken(data.token) 
                navigate("/i")
                toast.success("Ви успішно увійшли!")
            }
        } catch (e) {
            
            const message =
                e?.response?.data?.message ||
                "Сталася помилка."

            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>{config.title}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Ел. пошта</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...form.register("email")}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Пароль</FieldLabel>

                                    {config.showForgotPassword && (
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Забули пароль?
                                        </a>
                                    )}
                                </div>

                                <Input 
                                    id="password"
                                    type="password"
                                    {...form.register("password")}
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={loading} className="cursor-pointer">
                                    {loading ? "Зачекайте..." : config.submitText}
                                </Button>

                                <FieldDescription className="text-center">
                                    {config.footerText}
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}