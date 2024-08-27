
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { fetchSignin } from "@/store/slices/authSlice"
import { useDispatch } from "react-redux"
import { SigninValidation } from "@/lib/validations"
import { AppDispatch } from "@/types/types"
import { fetchItems } from "@/store/slices/itemsSlice"

import logo from "../../assets/logo.png"

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    type LoginFormValuesType = z.infer<typeof SigninValidation>;

    const onSubmit = async (values: LoginFormValuesType) => {
        try {
            const data = await dispatch(fetchSignin(values)).unwrap();
            if (data) {
                dispatch(fetchItems());
                return navigate('/');
            } else {
                alert('Не удалось авторизоваться');
            }
        } catch (error) {
            if (error == 401) {
                form.setError("password", {
                    type: "manual",
                    message: "Неправильный пароль"
                });
            } else {
                form.setError("email", {
                    type: "manual",
                    message: "Пользователь не найден"
                });
            }
        }
    };

    return (
        <Form {...form}>
            <div className="sm:w-[420px] flex-center flex-col">
                <div className="flex gap-3 justify-center items-center pt-3 sm:pt-6">
                    <img src={logo} className="w-[45px]" />
                    <h2 className='font-bold text-2xl'>Авторизация</h2>
                </div>
                <p className='text-muted-foreground small-medium md:base-regular mt-2 text-center'>Введите свои данные, для входа в аккаунт</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Почта</FormLabel>
                                <FormControl>
                                    <Input type='email' className='shad-input' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input type='password' className='shad-input' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className='shad-button_primary'>
                        Войти
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Нет аккаунта?
                        <Link to='/signup' className="text-indigo-200 text-small-semibold ml-1">Зарегистрироваться</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignIn