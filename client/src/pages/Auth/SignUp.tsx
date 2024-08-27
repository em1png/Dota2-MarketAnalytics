
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignupValidation } from "@/lib/validations"
import { AppDispatch } from "@/types/types"
import { useDispatch } from "react-redux"
import { fetchSignup } from "@/store/slices/authSlice"
import { fetchItems } from "@/store/slices/itemsSlice"

import logo from "../../assets/logo.png"

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
    })

    type RegisterFormValuesType = z.infer<typeof SignupValidation>
    const onSubmit = async (values: RegisterFormValuesType) => {
        try {
            const data = await dispatch(fetchSignup(values)).unwrap();
            if (data) {
                dispatch(fetchItems());
                navigate('/');
            } else {
                alert('Не удалось авторизоваться');
            }
        } catch (error) {
            if (error == 500) {
                form.setError("email", {
                    type: "manual",
                    message: "Эта почта уже используется"
                });
            }
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-[420px] flex-center flex-col">
                <div className="flex gap-3 justify-center items-center pt-3 sm:pt-6">
                    <img src={logo} className="w-[45px]" />
                    <h2 className='font-bold text-2xl'>Регистрация</h2>
                </div>
                <p className='text-muted-foreground small-medium md:base-regular mt-2 text-center'>Введите свои данные, для входа в аккаунт</p>


                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Никнейм</FormLabel>
                                <FormControl>
                                    <Input type='text' className='shad-input' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        Регистрация
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Нет аккаунта?
                        <Link to='/signin' className="text-indigo-200 text-small-semibold ml-1">Войти</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignUp