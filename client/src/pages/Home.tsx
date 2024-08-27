import StatFrame from "@/components/shared/StatFrame";
import { Button } from "@/components/ui/button";
import { IItem } from "@/types/types";
import { itemsListSelector } from "@/store/slices/itemsSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import BarChart from '../components/shared/BarChart';

import logo from "../assets/logo.png"

const Home = () => {
  // SELECTORS
  const items: IItem[] | null = useSelector(itemsListSelector);

  // FUNCTIONS
  const itemsCostSteamByWeeks = items && items.reduce((acc: number[], value) => {
    for (let i = 0; i < value.steamMarket.data.byWeeksData.length; i++) {
      acc[i] = (acc[i] || 0) + value.steamMarket.data.byWeeksData[i][1];
    }
    return acc;
  }, []);

  // VARS
  const currentDate = new Date();
  const lastUpdateDate = new Date(2024, 7, 23);
  const daysFromLastUpdate = Math.round((currentDate.getTime() - lastUpdateDate.getTime()) / (24 * 60 * 60 * 1000));

  const itemsCostSteamToday = items && items.reduce((acc, value) => acc + value.steamMarket.price, 0)
  const itemsCostD2marketToday = items && items.reduce((acc, value) => acc + value.steamMarket.price, 0)

  return (
    <main className="container mb-10 overflow-hidden">
      <section className="flex-start gap-3 noborder-frame">
        <img src={logo} alt="logo" height={60} width={60} className="object-contain h-[60px]" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Em — One</h1>
          <h2 className=" text-neutral-500">Инструмент для анализа торговой площадки Dota 2!</h2>
        </div>
      </section>

      <section className="flex flex-col xl:flex-row xl:gap-5">
        <StatFrame className='border-frame flex-1' title={'Последнее обновление'} value={lastUpdateDate.toLocaleDateString()} desc={`${daysFromLastUpdate} дн(я)ей прошло дней с момента последнего обновления`} />
        <StatFrame className='border-frame flex-1' title={'Примерное дней до обновления'} value={`${35 - daysFromLastUpdate}`} desc='Среднее время между обновлениями — 35 дней' />
        <StatFrame className='border-frame flex-1' title={'Состояние рынка'} value={
          <div className="flex">
            <div className="flex gap-1 pr-3 mr-3 border-r border-neutral-800">
              <span>{Math.round(itemsCostSteamToday! / 1000)}</span>
              <div className="flex-col-start text-[0.6rem] leading-3 font-normal">
                <p className="text-xs">Steam</p>
                <p className="text-neutral-400">тыс.</p>
              </div>
            </div>
            <div className="flex gap-1">
              <span>{Math.round(itemsCostD2marketToday! / 1000)}</span>
              <div className="flex-col-start text-[0.6rem] leading-3 font-normal">
                <p className="text-xs">D2 Market</p>
                <p className="text-neutral-400">тыс.</p>
              </div>
            </div>
          </div>
        } desc='Общая стоимость 1 ед. всех предметов' />
      </section>

      <section className="flex flex-col xl:flex-row gap-10">
        <div className="border-frame flex-1 bg-gradient-to-r to-70% from-green-600/5">
          <div className="border-b border-neutral-800 pb-5 mb-5">
            <h2 className="text-2xl font-semibold text-green-400 mb-1">Максимальная выгода</h2>
            <p className="text-xs text-neutral-500">Соотношение текущей цены к средней цене за год</p>
          </div>
          <ul className="flex flex-col gap-2 mb-5">
            {items ? [...items].sort((a, b) => (b.steamMarket.stats.averagePriceYear / (b.steamMarket.price / 100)) - (a.steamMarket.stats.averagePriceYear / (a.steamMarket.price / 100))).slice(0, 5).map((item, index) => (
              <li key={item._id} className="flex-start gap-3 pb-3 border-b last:border-b-0 border-neutral-900">
                <div className="flex-center min-w-[35px] min-h-full rounded-md text-center">
                  <span className="text-xl text-neutral-500">{index + 1}</span>
                </div>

                <Link to={`/item/${item._id}`} className="flex gap-3">
                  <div className="flex-center overflow-hidden h-[50px] w-[50px] min-h-[50px] min-w-[50px] rounded-full">
                    <img src={item.imageUrl} alt="" className="object-cover object-center w-[150%] h-[150%]" />
                  </div>


                  <div className="flex-col-start min-w-max">
                    <span className="text-sm text-neutral-500">{item.heroName}</span>
                    <span className="font-semibold">{item.itemName}</span>
                  </div>
                </Link>

                <div className="flex flex-col items-end w-full self-end">
                  <span className="font-semibold text-xl">{item.steamMarket.price} ₽</span>
                  <span className="text-sm text-green-400">{(item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100)).toFixed(0)}% ∙ {item.steamMarket.stats.averagePriceYear} ₽</span>
                </div>
              </li>
            ))
              :
              <div className="flex-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            }
          </ul>
          <Link to={'/rating'}>
            <Button variant={"outline"} className="w-full">Посмотреть все</Button>
          </Link>
        </div>

        <div className="border-frame flex-1 bg-gradient-to-l to-70% from-rose-600/5">
          <div className="border-b border-neutral-800 pb-5 mb-5">
            <h2 className="text-2xl font-semibold text-rose-500 mb-1">Минимальная выгода</h2>
            <p className="text-xs text-neutral-500">Соотношение текущей цены к средней цене за год</p>
          </div>
          <ul className="flex flex-col gap-2 mb-5">
            {items ? [...items].sort((a, b) => (b.steamMarket.price / (b.steamMarket.stats.averagePriceYear / 100)) - (a.steamMarket.price / (a.steamMarket.stats.averagePriceYear / 100))).slice(0, 5).map((item, index) => (
              <li key={item._id} className="flex-start gap-3 pb-3 border-b last:border-b-0 border-neutral-900">
                <div className="flex-center min-w-[35px] min-h-full rounded-md text-center">
                  <span className="text-xl text-neutral-500">{index + 1}</span>
                </div>

                <Link to={`/item/${item._id}`} className="flex gap-3">
                  <div className="flex-center overflow-hidden h-[50px] w-[50px] min-h-[50px] min-w-[50px] rounded-full">
                    <img src={item.imageUrl} alt="" className="object-cover object-center w-[150%] h-[150%]" />
                  </div>


                  <div className="flex flex-col justify-center min-w-max">
                    <span className="text-sm text-neutral-500">{item.heroName}</span>
                    <span className="font-semibold">{item.itemName}</span>
                  </div>
                </Link>

                <div className="flex flex-col items-end w-full self-end">
                  <span className="font-semibold text-xl">{item.steamMarket.price} ₽</span>
                  <span className="text-sm text-rose-400">{(item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100) - 100).toFixed(2)}% ∙ {item.steamMarket.stats.averagePriceYear} ₽</span>
                </div>
              </li>
            ))
              :
              <div className="flex-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>}
          </ul>
          <Link to={'/rating'}>
            <Button variant={"outline"} className="w-full">Посмотреть все</Button>
          </Link>
        </div>
      </section>

      <h3 className="font-semibold text-2xl">Индекс торговой площадки по неделям</h3>
      <div className="w-[100%] overflow-hidden">
        <BarChart data={itemsCostSteamByWeeks && itemsCostSteamToday && [itemsCostSteamToday, ...itemsCostSteamByWeeks]} color={`#adfa1d`} isPeriodByDays={false} />
      </div>
    </main>
  )
}

export default Home