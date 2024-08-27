import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ReactNode, useState } from "react"
import { CreateUserSellItemValidation } from "@/lib/validations"
import axios from "@/axios"
import { RootState, IUserItem } from "@/types/types"
import { useSelector } from "react-redux"
import { useAddSalesHistoryMutation } from "@/store/queries/userSoldItemsApi"
import { useDeleteItemMutation, useEditItemMutation } from "@/store/queries/userOwnedItemsApi"

const CreateUserSellItem = ({ reqType, item, title, className }: { title: string | ReactNode, reqType: 'POST' | 'PUT', item: IUserItem, className: string }) => {
    const userData = useSelector((store: RootState) => store.user.data);
    console.log(item);

    const [ addSalesHistory ] = useAddSalesHistoryMutation();
    const [ deleteUserItem ] = useDeleteItemMutation();
    const [ editOwnedItem ] = useEditItemMutation();

    const form = useForm<z.infer<typeof CreateUserSellItemValidation>>({
        resolver: zodResolver(CreateUserSellItemValidation),
        defaultValues: {
            buyPrice: item.buyPrice,
            sellPrice: item.itemInfo.currentPrice,
            quantity: item.quantity,
        },
    })

    function onSubmit(values: z.infer<typeof CreateUserSellItemValidation>) {
        if (reqType == 'POST') {
            addSalesHistory({ ...values, userId: userData?._id, itemId: item.itemId })

            if(values.quantity < item.quantity) editOwnedItem({ "itemId": item._id, "quantity": item.quantity - values.quantity })
            else deleteUserItem({itemId: item._id})
        }
        if (reqType == 'PUT') axios.post(`/api/items`, values).then(response => console.log(response)).catch(error => console.error(error));
        form.reset();
        setIsModalOpen(false);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div>
            <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
                <DialogTrigger className={`flex justify-center items-center border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md text-xs ${className}`}>
                    {title}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-2 text-2xl">Добавление истории продажи</DialogTitle>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="buyPrice" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Введите стоимость покупки</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="sellPrice" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Введите стоимость продажи</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="quantity" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Введите количество</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit">Добавить</Button>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateUserSellItem