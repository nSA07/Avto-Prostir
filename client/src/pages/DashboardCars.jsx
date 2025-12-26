import { Plus, Car as CarIcon, Gauge, ChevronRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useGenericQuery } from "@/hooks/useGenericQuery";
import { carService } from "@/api/cars.service";

export const DashboardCars = () => {
    const navigate = useNavigate();
    const KILOMETERS_IN_MILE = 1.60934;

    const { data: cars, isLoading } = useGenericQuery({
        queryKey: ["cars"],
        queryFn: carService.getAllCars,
    });
     
    if (isLoading) return null;

    if (!cars || cars.length === 0) {
        return <EmptyCarsState navigate={navigate} />;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Мій гараж</h2>
                    <p className="text-sm text-muted-foreground">Усього автомобілів: {cars.length}</p>
                </div>
                <Button 
                    size="sm" 
                    onClick={() => navigate('/i/cars/new')} 
                    className="rounded-full px-4 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" /> Додати авто
                </Button>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cars.map((car) => {
                    // Рахуємо милі на основі останнього пробігу (якщо він є в об'єкті car)
                    const mileageKm = car.currentMileage || 0;
                    const mileageMiles = Math.round(mileageKm / KILOMETERS_IN_MILE);

                    return (
                        <Card 
                            key={car.id} 
                            className="group relative overflow-hidden border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => navigate(`/i/cars/${car.id}`)}
                        >
                            <CardContent className="p-5">
                                {/* Блок з Держ Номером */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="inline-flex items-center px-2 py-1 bg-slate-100 border-2 border-slate-200 rounded text-xs font-bold tracking-widest text-slate-700 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors uppercase">
                                        <Hash className="h-3 w-3 mr-1 text-slate-400" />
                                        {car.plate || "БЕЗ НОМЕРА"}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{car.year}</span>
                                </div>

                                {/* Назва авто */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                                        {car.name}
                                    </h3>
                                </div>

                                {/* Блок Пробігу */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Пробіг км</p>
                                        <div className="flex items-center text-sm font-semibold text-slate-700">
                                            <Gauge className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                            {mileageKm.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Пробіг mi</p>
                                        <div className="flex items-center text-sm font-semibold text-slate-700">
                                            {mileageMiles.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Декоративна стрілка переходу */}
                                <div className="absolute top-1/2 -right-1 translate-y-[-50%] opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all">
                                    <ChevronRight className="h-5 w-5 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const EmptyCarsState = ({ navigate }) => (
    <div className="flex flex-1 flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="bg-slate-50 p-10 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-300">
                <CarIcon className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-600 mb-2">Ваш гараж порожній</h2>
            <p className="text-sm text-slate-400 mb-6 text-center max-w-[250px]">Додайте свій перший автомобіль за держномером або назвою</p>
            <Button onClick={() => navigate('/i/cars/new')} className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> Додати авто
            </Button>
        </div>
    </div>
);