import { Link } from "react-router";
import { Car, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              AVTO<span className="text-indigo-600">PROSTIR</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-semibold text-slate-600">
              <Link to="/login">Увійти</Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-5 shadow-md shadow-indigo-100">
              <Link to="/register">Створити акаунт</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="h-3 w-3" /> Твій технічний простір
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Керуй історією свого <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              автомобіля професійно
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            Цифровий технічний журнал для тих, хто цінує порядок. 
            Відстежуйте сервіс, пробіг та витрати в один клік.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto rounded-full px-8 h-12 text-md font-bold bg-slate-900 hover:bg-slate-800 shadow-xl">
              <Link to="/register">Почати безкоштовно</Link>
            </Button>
            <div className="text-sm text-slate-400 font-medium">
              Без кредитної картки • Безкоштовно до 500 МБ даних
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-indigo-600" />}
              title="Безпечне зберігання"
              description="Всі записи про сервіс та запчастини зберігаються в хмарі. Ви ніколи не загубите історію обслуговування."
            />
            <FeatureCard 
              icon={<Gauge className="h-6 w-6 text-blue-500" />}
              title="Аналітика пробігу"
              description="Автоматичний перерахунок км/милі та відстеження актуального стану одометра вашого авто."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
              title="Контроль витрат"
              description="Чітке розуміння вартості володіння автомобілем. Всі чеки та ціни в одному технічному звіті."
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            © 2025 Avto Prostir. Зроблено з інженерним підходом для водіїв.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Допоміжний компонент для фіч
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

// Для одометра в фічах (якщо Gauge не імпортований зверху)
const Gauge = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
  </svg>
);