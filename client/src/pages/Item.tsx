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

  useMemo(() => item && setCurrentPeriod([[null, item.price.steam, item.steamData.byWeeksData[0][2]], ...item.steamData.byWeeksData.slice(0, 48)]), [item]);

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
            <div className='flex gap-5'>
              <div className="relative flex items-center justify-center min-w-[90px] min-h-[90px] w-[90px] h-[90px] rounded-md overflow-hidden">
                <img src={item.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
              </div>

              <div className='flex flex-col justify-center gap-1'>
                <div className='flex gap-3 items-end'>
                  <h3 className='font-bold text-3xl'>{item.itemName}</h3>

                  {item.steamData.byWeeksData.length <= 48 &&
                    <Button variant={'destructive'} className='h-[20px]'>
                      New
                    </Button>
                  }
                </div>

                <h4 className='text-neutral-400 text-base'>{item.heroName}</h4>
                <p className='font-bold text-2xl'>{item.price.steam}₽</p>
              </div>
            </div>

            <div className='flex-col gap-5'>
              <div className='flex flex-col md:flex-row gap-2 mb-2'>

                <Link to={`https://steamcommunity.com/market/listings/570/${item.itemName}`}>
                  <Button variant={'outline'} className='flex-center gap-2 h-[40px] px-4 py-2'>
                    <img src="https://i.imgur.com/C9NtkaC.png" height={15} width={15} alt="1" />
                    <p className='font-semibold'>{item.price.steam} ₽</p>
                  </Button>
                </Link>

                <Link to={`https://market.dota2.net/?search=${item.itemName}&sd=desc`}>
                  <Button variant={'outline'} className='flex-center gap-2 h-[40px] px-4 py-2'>
                    <img src="/d2marketLogo.png" height={15} width={15} alt="1" />
                    <p className='font-semibold'>{item.price.d2market} ₽</p>
                  </Button>
                </Link>

                <CreateUserItemForm itemID={item._id} className="h-[40px] w-[40px]" title={<PlusIcon />} />
              </div>
            </div>
          </div>

          <h3 className='text-sm font-bold mb-2'>ТОРГОВЫЕ ПЛОЩАДКИ</h3>
          <div className='grid grid-cols-5 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>

            <Link to={`https://steamcommunity.com/market/listings/570/${item.itemName}`}>
              <div className='flex-start gap-5'>
                <img src="https://i.imgur.com/C9NtkaC.png" alt="Steam" className='w-[45px] h-[45px]' />
                <div>
                  <p className="text-2xl font-bold">{`${item.price.steam} ₽`}</p>
                  <p className={`text-xs font-semibold text-white`}>—</p>
                </div>
              </div>
            </Link>

            <Link to={`https://market.dota2.net/?search=${item.itemName}&sd=desc`}>
              <div className='pl-10 border-l border-neutral-800 flex-start gap-5'>
                <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
                <div>
                  <p className="text-2xl font-bold">{`${item.price.d2market} ₽`}</p>
                  <p className={`text-xs font-semibold ${(item.price.d2market - item.price.steam) <= 0 ? `text-green-400` : `text-rose-400`}`}>{item.price.d2market - item.price.steam} ₽ ∙ {Math.round(100 - (item.price.d2market / (item.price.steam / 100)))}%</p>
                </div>
              </div>
            </Link>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold ${(item.price.d2market - item.price.steam) <= 0 ? `text-green-400` : `text-rose-400`}`}>—</p>
              </div>
            </div>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold ${(item.price.d2market - item.price.steam) <= 0 ? `text-green-400` : `text-rose-400`}`}>—</p>
              </div>
            </div>

            <div className='pl-10 border-l border-neutral-800 flex-start gap-5 blur-sm'>
              <img src="/d2marketLogo.png" alt="Dota2 Market" className='w-[35px] h-[35px]' />
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className={`text-xs font-semibold ${(item.price.d2market - item.price.steam) <= 0 ? `text-green-400` : `text-rose-400`}`}>—</p>
              </div>
            </div>
          </div>

          <h3 className='text-sm font-bold mb-2'>СРЕДНЯЯ ЦЕНА</h3>
          <div className='grid grid-cols-5 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>
            <div className='pl-10'>
              <h3 className="text-xs font-normal">За неделю</h3>
              <p className="text-2xl font-bold">{`${item.steamData.byWeeksData[0][1]} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">За 3 месяца</h3>
              <p className="text-2xl font-bold">{`${Math.round(item.steamData.byWeeksData.slice(0, 12).reduce((acc, value) => acc + value[1], 0) / 12)} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${Math.round(item.steamData.byWeeksData.slice(0, 12).reduce((acc, value) => acc + value[1], 0) / 12) - item.price.steam}₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">За полгода</h3>
              <p className="text-2xl font-bold">{`${(item.steamData.byWeeksData.slice(0, 180).reduce((acc, value) => acc + value[1], 0) / 180).toFixed(0)} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${((item.steamData.byWeeksData.slice(0, 180).reduce((acc, value) => acc + value[1], 0) / 180) - item.price.steam).toFixed(1)}₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">За год</h3>
              <p className="text-2xl font-bold">{`${item.steamData.averagePriceYear} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${(item.steamData.averagePriceYear - item.price.steam).toFixed(1)}₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">За все время</h3>
              <p className="text-2xl font-bold">{`${item.steamData.averagePriceAlltime} ₽`}</p>
              <p className="text-xs text-muted-foreground">{`${(item.steamData.averagePriceAlltime - item.price.steam).toFixed(1)}₽ от текущей`}</p>
            </div>
          </div>

          <h3 className='text-sm font-bold mb-2'>МИН. И МАКС. ЦЕНА</h3>
          <div className='grid grid-cols-5 rounded-xl border bg-neutral-900/50 text-card-foreground shadow mb-5 p-5'>

            <div className='pl-10'>
              <h3 className="text-xs font-normal mb-1">Мин. за год</h3>
              <p className="text-2xl font-bold">{item.steamData.minPriceYear} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamData.minPriceYear - item.price.steam} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">Макс. за год</h3>
              <p className="text-2xl font-bold">{item.steamData.maxPriceYear} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamData.maxPriceYear - item.price.steam} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800' />

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal">Мин. за все время</h3>
              <p className="text-2xl font-bold">{item.steamData.minPriceAlltime} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamData.minPriceAlltime - item.price.steam} ₽ от текущей`}</p>
            </div>

            <div className='pl-10 border-l border-neutral-800'>
              <h3 className="text-xs font-normal mb-1">Макс. за все время</h3>
              <p className="text-2xl font-bold">{item.steamData.maxPriceAlltime} ₽</p>
              <p className="text-xs text-muted-foreground">{`${item.steamData.maxPriceAlltime - item.price.steam} ₽ от текущей`}</p>
            </div>
          </div>

          <div className='h-[1px] bg-neutral-800 my-10' />

          <p className='text-xl font-bold'>СРЕДНЯЯ ЦЕНА ПРЕДМЕТА</p>
          <div className='flex justify-start'>
            <BarChart arrayIndex={1} color={`#adfa1d`} data={currentPeriod as [Date | null, number, number][]} isPeriodByDays={isPeriodByDays} />
          </div>

          <div className='h-[1px] bg-neutral-800 my-10' />
          <p className='text-xl font-bold'>СРЕДНЕЕ КОЛИЧЕСТВО ПРОДАННЫХ ПРЕДМЕТОВ В ДЕНЬ</p>
          <BarChart arrayIndex={2} color={`#1e7afa`} data={currentPeriod as [Date | null, number, number][]} isPeriodByDays={isPeriodByDays} />

          <ToggleGroup type="single" variant={'default'} defaultValue='year'>
            <ToggleGroupItem onClick={() => {
              setCurrentPeriod(item?.steamData.monthData.reduce((acc: [Date | null, number, number][], value) => {
                acc.push([null, value[1], value[2]]);
                return acc
              }, [[null, item.price.steam, 0]]));
              setIsPeriodByDays(true);
            }} value="month" aria-label="Toggle italic">
              <p> Месяц </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.price.steam, 0], ...item.steamData.byWeeksData.slice(0, 24)]);
              setIsPeriodByDays(false);
            }} value="halfyear" aria-label="Toggle strikethrough">
              <p> Полгода </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.price.steam, 0], ...item.steamData.byWeeksData.slice(0, 48)]);
              setIsPeriodByDays(false);
            }} value="year" aria-label="Toggle strikethrough">
              <p> Год </p>
            </ToggleGroupItem>

            <ToggleGroupItem onClick={() => {
              setCurrentPeriod([[null, item.price.steam, 0], ...item.steamData.byWeeksData]);
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
