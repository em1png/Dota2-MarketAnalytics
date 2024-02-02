import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { createItemValidation } from "@/lib/validations"
import axios from "@/axios"

const CreateItemForm = () => {
  const form = useForm<z.infer<typeof createItemValidation>>({
    resolver: zodResolver(createItemValidation),
    defaultValues: {
      heroName: "",
      itemName: "",
      imageURL: "",
    },
  })

  function onSubmit(values: z.infer<typeof createItemValidation>) {
    axios.post(`/api/items`, values)
      .then(response => console.log(response))
      .catch(error => console.error(error));

    form.reset();
    setIsModalOpen(false);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger className="border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
          Добавить
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2 text-2xl">Добавление нового предмета</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="heroName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Введите название героя</FormLabel>
                    <FormControl>
                      <Input placeholder="Phantom Lancer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="itemName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Введите название предмета</FormLabel>
                    <FormControl>
                      <Input placeholder="Concord Dominion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="imageURL" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Введите ссылку на изображение</FormLabel>
                    <FormControl>
                      <Input placeholder="https://i.imgur.com/KMfKJUf_d.webp" {...field} />
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

export default CreateItemForm