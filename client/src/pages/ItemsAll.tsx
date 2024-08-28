import CreateItemForm from "@/components/forms/CreateItemForm";
import CreateUserItemForm from "@/components/forms/CreateUserItemForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from "react-redux";
import { itemsListSelector, updateItem } from "@/store/slices/itemsSlice";
import { Input } from "@/components/ui/input";
import { AppDispatch } from "@/types/types";

const ItemsAll = () => {
  // HOOKS
  const dispatch: AppDispatch = useDispatch();

  // STATES
  const [searchField, setSearchField] = useState('');

  // SELECTORS
  const itemsFetch = useSelector(itemsListSelector);

  return (
    <div className='container mb-10'>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">ДОСТУПНО ПРЕДМЕТОВ — {itemsFetch && itemsFetch.length}</h1>
        <CreateItemForm />
        <Button size={"sm"} variant={"outline"}><UpdateIcon /></Button>
      </div>
      <p className="t text-sm mb-5 text-white/70">{itemsFetch && new Date(itemsFetch[itemsFetch.length - 1]?.updatedAt).toLocaleString()}</p>
      <Input className="mb-5" placeholder="Поиск, введите название героя или предмета" type="text" value={searchField} onChange={(event) => setSearchField(event.target.value)} />
      {itemsFetch && itemsFetch.length > 0
        ? <ul className="grid grid-cols-3 gap-3">
          {
            itemsFetch?.filter((item) => item.heroName.toLowerCase().includes(searchField.toLocaleLowerCase()) || item.itemName.toLowerCase().includes(searchField.toLocaleLowerCase())).slice(0, 24).map(item =>
              <li key={item.itemName} className='flex justify-between gap-5 items-center border border-secondary rounded-md p-3'>
                <Link to={`/item/${item._id}`}>
                  <div className='flex gap-3'>

                    <div className="flex items-center justify-center min-w-[50px] min-h-[50px] w-[50px] h-[50px] rounded-md overflow-hidden">
                      <img src={item.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
                    </div>

                    <div className='flex flex-col justify-center gap-1'>
                      <h2 className='text-neutral-300 text-xs'>{item.itemName}</h2>
                      <div className="font-bold text-lg">{item.steamMarket.price}₽ </div>
                    </div>
                  </div>
                </Link>

                <div className="flex justify-center items-end gap-3">
                  <CreateUserItemForm itemID={item._id} className="h-9 w-9" title={<PlusIcon />} buyPrice={item.steamMarket.price} />
                </div>
              </li>
            )
          }
        </ul>
        : <Button variant={"destructive"}>Items not found..</Button>
      }
    </div >
  )
}

export default ItemsAll