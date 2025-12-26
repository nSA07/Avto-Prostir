import { useNavigate } from "react-router"
import { useState } from "react"

import { MoreHorizontal, Plus, Trash2, Pencil, Car } from "lucide-react"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { carService } from "@/api/cars.service"
import { useGenericQuery } from "@/hooks/useGenericQuery"
import { useDeleteEntity } from "@/hooks/useDeleteEntity"

export function NavCars() {
    const { isMobile } = useSidebar()
    const navigate = useNavigate()
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [carToDelete, setCarToDelete] = useState(null)

    const { deleteEntity } = useDeleteEntity({
        mutationKey: "deleteCars",
        mutationFn: (id) => carService.deleteCar(id),
        redirectTo: '/i',
        invalidateQueryKey: "cars",
    });

    const { data: cars, isLoading } = useGenericQuery({
        queryKey: ["cars"],
        queryFn: carService.getAllCars,
    })    

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-6">
            <SidebarGroupLabel>Мої автомобілі</SidebarGroupLabel>
            <SidebarMenu>
                {cars?.map((car) => (
                    <SidebarMenuItem key={car.id}>
                        <SidebarMenuButton asChild>
                            <Link to={`/i/cars/${car.id}`}>
                                <Car className="text-muted-foreground" />
                                <span>{car.name}</span>
                            </Link>
                        </SidebarMenuButton>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem onClick={() => navigate(`/i/cars/${car.id}/edit`)}>
                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Редагувати</span>
                                </DropdownMenuItem>

                                {/* Просто пункт меню, який відкриває діалог */}
                                <DropdownMenuItem 
                                    className="text-destructive cursor-pointer"
                                    onSelect={(e) => {
                                        e.preventDefault(); // Запобігаємо закриттю меню за замовчуванням
                                        setCarToDelete(car);
                                        setIsAlertOpen(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Видалити</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                    <SidebarMenuButton 
                        className="text-sidebar-foreground/70 cursor-pointer" 
                        onClick={() => navigate('/i/cars/new')}
                    >
                        <Plus className="h-4 w-4" />
                        <span>Додати автомобіль</span>
                    </SidebarMenuButton>  
                </SidebarMenuItem>
            </SidebarMenu>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Автомобіль <strong>{carToDelete?.name}</strong> буде видалено назавжди.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Відміна</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90 text-white"
                            onClick={() => {
                                deleteEntity(carToDelete.id);
                                setIsAlertOpen(false);
                            }}
                        >
                            Видалити
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarGroup>
    )
}