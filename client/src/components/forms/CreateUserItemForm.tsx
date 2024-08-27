import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import {useSelector } from "react-redux"
import { IUserData, RootState } from "../../types/types"
import { useAddItemMutation } from "@/store/queries/userOwnedItemsApi"

const formSchema = z.object({
  buyPrice: z.coerce.number(),
  quantity: z.coerce.number(),
})

type CreateUserItemFormType = {
  itemID: string;
  className: string;
  title: React.ReactNode | string;
  buyPrice: number;
}
const CreateUserItemForm: React.FC<CreateUserItemFormType> = ({ itemID, className, title, buyPrice }) => {
  const user = useSelector((store: RootState) => store.user.data as IUserData);
  const [addItemToUser] = useAddItemMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyPrice: buyPrice || 0,
      quantity: 1,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addItemToUser({userId: user._id, itemId: itemID, buyPrice: values.buyPrice, quantity: values.quantity})
    form.reset();
    setIsModalOpen(false);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div>
        <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
          <DialogTrigger className={`${className} inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md text-xs`}>
            {title}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl">Добавление нового предмета</DialogTitle>
              {/* Форма */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Введите стоимость предмета</FormLabel>
                        <FormControl>
                          <Input type="number" inputMode="numeric" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Введите количество предметов</FormLabel>
                        <FormControl>
                          <Input type="number" inputMode="numeric" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Добавить</Button>
                </form>
              </Form>
              {/* Конец формы */}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>

  )
}

export default CreateUserItemForm