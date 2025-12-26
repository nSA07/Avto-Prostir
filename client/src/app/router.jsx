import { createBrowserRouter } from "react-router";
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import { AdminLayout } from '../pages/AdminLayout'
import { requireAuthLoader, publicOnlyLoader } from '../auth/auth.loader'
import { LandingPage } from "@/pages/LandingPage";
import { DashboardCars } from "@/pages/DashboardCars";
import { CarFormPage } from "@/pages/CarFormPage";
import { CarDetailsPage } from "@/pages/CarDetailsPage";
import { AddServiceRecordPage } from "@/pages/AddServiceRecordPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/i',
        element: <AdminLayout />,
        loader: requireAuthLoader,
        children: [
            {
                index: true,
                element: <DashboardCars />
            },
            {
                path: 'cars/:id',
                element: <CarDetailsPage />
            },
            {
                path: 'cars/:id/service-records/new',
                element: <AddServiceRecordPage mode="create" />
            },
            {
                path: 'cars/:id/service-records/:recordId/edit',
                element: <AddServiceRecordPage mode="edit" />
            },
            {
                path: 'cars/new',
                element: <CarFormPage mode="create" />
            },
            {
                path: 'cars/:id/edit',
                element: <CarFormPage mode="edit" />
            }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />,
        loader: publicOnlyLoader
    },
    {
        path: '/register',
        element: <RegisterPage />,
        loader: publicOnlyLoader
    },
])
