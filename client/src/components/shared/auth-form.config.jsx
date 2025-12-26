import { login, register } from "../../api/auth.api"
import { Link } from "react-router";

export const CONFIG = {
    login: {
        title: 'Увійти в акаунт',
        description: 'Введіть свої дані для входу в акаунт',
        submitText: 'Увійти',
        footerText: (
            <>
                Ще не зареєстровані? <Link to="/register">Реєстрація</Link>
            </>
        ),
        showForgotPassword: true,
        onSubmit: login,
    },
    register: {
        title: 'Створити акаунт',
        description: 'Введіть свої дані для створення акаунта',
        submitText: 'Реєстрація',
        footerText: (
            <>
                Вже маєте акаунт? <Link to="/login">Увійти</Link>
            </>
        ),
        showForgotPassword: false,
        onSubmit: register,
    }
}