import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import BarChart from '../components/shared/BarChart';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../types/types"
import CreateUserItemForm from '@/components/forms/CreateUserItemForm';
import { PlusIcon } from '@radix-ui/react-icons';
import { deleteItem, itemsListSelector, updateItem } from '@/store/slices/itemsSlice';

const Item = () => {
  // HOOKS
  const { itemID } = useParams();
  const { toast } = useToast()
  const dispatch: AppDispatch = useDispatch();

  // STATES
  const [currentPeriod, setCurrentPeriod] = useState<[null | Date, number, number][] | null>(null);
  const [isPeriodByDays, setIsPeriodByDays] = useState<boolean>(true);

  // SELECTORS
  const authUserData = useSelector((store: RootState) => store.user.data);
  const itemsFetch = useSelector(itemsListSelector);

  // CONSTS
  const item = itemsFetch?.find((entry) => entry._id == itemID);

  useMemo(() => item && setCurrentPeriod([[null, item.steamMarket.price, item.steamMarket.data.byWeeksData[0][2]], ...item.steamMarket.data.byWeeksData.slice(0, 48)]), [item]);

  return (
    <div className='container overflow-hidden'>
      {item ?
        <>
          {authUserData && authUserData.accessLevel == 'admin' &&
            <div className='flex items-center gap-3 flex-nowrap'>
              <Button size={'sm'} variant={'outline'} onClick={async () => {
                const res = await dispatch(deleteItem({ itemId: item._id }));
                if (res) toast({ variant: "default", title: "Предмет был успешно удален!" })
                else toast({ variant: "destructive", title: "Ошибка удаления предмета!" })
              }}>
                ⤭ Удалить предмет
              </Button>

              <Button size={'sm'} variant={'outline'} onClick={async () => {
                const res = await dispatch(updateItem({ itemId: item._id, steamCurrentPrice: true, d2marketCurrentPrice: false, steamGeneralData: false }));
                if (res) toast({ variant: "default", title: "Предмет был успешно обновлен!" })
                else toast({ variant: "destructive", title: "Ошибка обновления предмета!" })
              }}>
                ⤭ Current Steam
              </Button>

              <Button size={'sm'} variant={'outline'} onClick={async () => {
                const res = await dispatch(updateItem({ itemId: item._id, steamGeneralData: true }));
                if (res) toast({ variant: "default", title: "Предмет был успешно обновлен!" })
                else toast({ variant: "destructive", title: "Ошибка обновления предмета!" })
              }}>
                ⤭ General Steam
              </Button>

              <Button size={'sm'} variant={'outline'} onClick={async () => {
                const res = await dispatch(updateItem({ itemId: item._id, d2marketCurrentPrice: true }));
                if (res) toast({ variant: "default", title: "Предмет был успешно обновлен!" })
                else toast({ variant: "destructive", title: "Ошибка обновления предмета!" })
              }}>
                ⤭ Dota2 market
              </Button>
              <p className='text-sm'>Последнее обновление: {new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          }

          <div className='h-[150px] flex justify-between gap-5 items-center'>
            <div className='flex items-center gap-5'>
              <div className="relative flex items-center justify-center w-[70px] h-[70px] rounded-md overflow-hidden">
                <img src={item.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
              </div>

              <div className='flex flex-col justify-center gap-1'>
                <div className='flex gap-3 items-end'>
                  <h3 className='font-bold text-4xl'>{item.itemName}</h3>

                  {item.steamMarket.data.byWeeksData.length <= 48 &&
                    <Button variant={'destructive'} className='h-[20px]'>
                      New
                    </Button>
                  }
                </div>

                <h4 className='text-neutral-400 text-xl'>{item.heroName}</h4>
                {/* <p className='font-bold text-2xl'>{item.steamMarket.price}₽</p> */}
              </div>
            </div>

            <div className='flex-col gap-5'>
              <div className='flex flex-col md:flex-row gap-2 mb-2'>
                <CreateUserItemForm itemID={item._id} className="h-[40px] w-[40px]" buyPrice={item.steamMarket.price} title={<PlusIcon />} />
              </div>
            </div>
          </div>

          <h3 className='text-sm font-bold mb-2'>ТОРГОВЫЕ ПЛОЩАДКИ</h3>
          <div className='grid grid-cols-5 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>

            <Link to={`https://steamcommunity.com/market/listings/570/${item.itemName}`}>
              <div className='flex-start gap-5'>
                <img src="https://i.imgur.com/C9NtkaC.png" alt="Steam" className='w-[45px] h-[45px]' />
                <div>
                  <p className="text-2xl font-bold">{`${item.steamMarket.price} ₽`}</p>
                </div>
              </div>
            </Link>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold`}>—</p>
              </div>
            </div>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold`}>—</p>
              </div>
            </div>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold`}>—</p>
              </div>
            </div>

          </div>

          <h3 className='text-sm font-bold mb-2'>СРЕДНЯЯ ЦЕНА</h3>
          <div className='grid grid-cols-4 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>
            <div className='pl-10'>
              <h3 className="text-xs font-normal">⨶ За неделю</h3>
              <p className="text-2xl font-bold">{`${item.steamMarket.data.byWeeksData[0][1]} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${item.steamMarket.data.byWeeksData[0][1] - item.steamMarket.price} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">⨶ За 3 месяца</h3>
              <p className="text-2xl font-bold">{`${Math.round(item.steamMarket.data.byWeeksData.slice(0, 12).reduce((acc, value) => acc + value[1], 0) / 12)} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${Math.round(item.steamMarket.data.byWeeksData.slice(0, 12).reduce((acc, value) => acc + value[1], 0) / 12) - item.steamMarket.price}₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">⨶ За полгода</h3>
              <p className="text-2xl font-bold">{`${(item.steamMarket.data.byWeeksData.slice(0, 24).reduce((acc, value) => acc + value[1], 0) / 24).toFixed(0)} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${((item.steamMarket.data.byWeeksData.slice(0, 24).reduce((acc, value) => acc + value[1], 0) / 24) - item.steamMarket.price).toFixed(1)}₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">⨶ За год</h3>
              <p className="text-2xl font-bold">{`${item.steamMarket.stats.averagePriceYear} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${(item.steamMarket.stats.averagePriceYear - item.steamMarket.price).toFixed(1)}₽ от текущей`}</p>
            </div>
          </div>

          <h3 className='text-sm font-bold mb-2 text-white/80'>МИНИМАЛЬНАЯ И МАКСИМАЛЬНАЯ ЦЕНА</h3>
          <div className='grid grid-cols-2 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>

            <div className='pl-10'>
              <h3 className="text-xs font-normal mb-1">🡣 Минимальная за год</h3>
              <p className="text-2xl font-bold">{item.steamMarket.stats.minPriceYear} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamMarket.stats.minPriceYear - item.steamMarket.price} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">🡡 Максимальная за год</h3>
              <p className="text-2xl font-bold">{item.steamMarket.stats.maxPriceYear} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamMarket.stats.maxPriceYear - item.steamMarket.price} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800' />
          </div>

          <div className='h-[1px] bg-neutral-800 my-10' />

          <p className='text-xl font-bold'>СРЕДНЯЯ ЦЕНА ПРЕДМЕТА</p>
          <div className='flex justify-center items-center'>
            <BarChart arrayIndex={1} color={`#adfa1d`} data={currentPeriod as [Date | null, number, number][]} isPeriodByDays={isPeriodByDays} />
          </div>

          <div className='h-[1px] bg-neutral-800 my-10' />
          <p className='text-xl font-bold'>СРЕДНЕЕ КОЛИЧЕСТВО ПРОДАННЫХ ПРЕДМЕТОВ В ДЕНЬ</p>
          <div className='flex justify-center items-center'>
            <BarChart arrayIndex={2} color={`#1e7afa`} data={currentPeriod as [Date | null, number, number][]} isPeriodByDays={isPeriodByDays} />
          </div>

          <ToggleGroup type="single" variant={'default'} defaultValue='year'>
            <ToggleGroupItem onClick={() => {
              setCurrentPeriod(item?.steamMarket.data.monthData.reduce((acc: [Date | null, number, number][], value) => {
                acc.push([null, value[1], value[2]]);
                return acc
              }, [[null, item.steamMarket.price, 0]]));
              setIsPeriodByDays(true);
            }} value="month" aria-label="Toggle italic">
              <p> Месяц </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.steamMarket.price, 0], ...item.steamMarket.data.byWeeksData.slice(0, 24)]);
              setIsPeriodByDays(false);
            }} value="halfyear" aria-label="Toggle strikethrough">
              <p> Полгода </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.steamMarket.price, 0], ...item.steamMarket.data.byWeeksData.slice(0, 48)]);
              setIsPeriodByDays(false);
            }} value="year" aria-label="Toggle strikethrough">
              <p> Год </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.steamMarket.price, 0], ...item.steamMarket.data.byWeeksData]);
              setIsPeriodByDays(false);
            }} value="alltime" aria-label="Toggle strikethrough">
              <p> Все время </p>
            </ToggleGroupItem>
          </ToggleGroup>
        </>
        :
        <Button variant={'destructive'}>Предмет не найден</Button>
      }
    </div >
  )
}

export default Item
