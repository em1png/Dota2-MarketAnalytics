import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";
import { IFetchGetUserOwnedItems, IItem, RootState } from "@/types/types";
import { useSelector } from "react-redux";
import { itemsListSelector } from "@/store/slices/itemsSlice";
import { Input } from "@/components/ui/input";
import { useGetItemsQuery } from "@/store/queries/userOwnedItemsApi";

const ItemsRating = () => {
    // STATES
    const [sortType, setSortType] = useState<string>("bestByAveragePricePercentage"); // Тип сортировки, по ср. цене, по макс. низкой и т.д.
    const [sort, setSort] = useState<IItem[] | null>(null); // Отсортированный массив предметов с учетом фильтров.

    // SELECTORS
    const data = useSelector(itemsListSelector);
    const userData = useSelector((store: RootState) => store.user.data);
    const { data: userItemsQuery } = useGetItemsQuery(userData!._id);

    // REFS
    const filters = useRef({ minPrice: 0, maxPrice: 0, minProfit: 0, minAvgSellQ: 0, minAvgPrice: 0 });

    // FUNCTIONS
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!data) return false;
        let newSortedArr: IItem[] | null = data && [...data] as IItem[];

        if (filters.current.minPrice) newSortedArr = newSortedArr.filter((item) => item.steamMarket.price >= filters.current.minPrice);
        if (filters.current.maxPrice) newSortedArr = newSortedArr.filter((item) => item.steamMarket.price <= filters.current.maxPrice);
        if (filters.current.minProfit) newSortedArr = newSortedArr.filter((item) => (item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100)) - 100 >= filters.current.minProfit);
        if (filters.current.minAvgSellQ) newSortedArr = newSortedArr.filter((item) => item.steamMarket.stats.averageSalesYear >= filters.current.minAvgSellQ);
        if (filters.current.minAvgPrice) newSortedArr = newSortedArr.filter((item) => item.steamMarket.stats.averagePriceYear >= filters.current.minAvgPrice);
        setSort(sorting(newSortedArr, sortType));
    }

    const handleReset = () => {
        filters.current = {
            minPrice: 0,
            maxPrice: 0,
            minProfit: 0,
            minAvgSellQ: 0,
            minAvgPrice: 0,
        };
        setSort(sorting([...data!], sortType));
    }

    const sorting = (arr: IItem[], sortType: string) => {
        setSortType(sortType);

        switch (sortType) {
            case "bestByAveragePricePercentage": return arr.sort((a, b) => (b.steamMarket.stats.averagePriceYear / (b.steamMarket.price / 100)) - (a.steamMarket.stats.averagePriceYear / (a.steamMarket.price / 100)))
            case "worstByAveragePricePercentage": return arr.sort((a, b) => (b.steamMarket.price / (b.steamMarket.stats.averagePriceYear / 100)) - (a.steamMarket.price / (a.steamMarket.stats.averagePriceYear / 100)))
            case "closestToLowerBoundsPercentage": return arr.sort((a, b) => (b.steamMarket.stats.minPriceYear / (b.steamMarket.price / 100)) - (a.steamMarket.stats.minPriceYear / (a.steamMarket.price / 100)))
            case "closestToUpperBoundsPercentage": return arr.sort((a, b) => (b.steamMarket.price / (b.steamMarket.stats.maxPriceYear / 100)) - (a.steamMarket.price / (a.steamMarket.stats.maxPriceYear / 100)))
            case "farthestFromUpperBoundsInRubles": return arr.sort((a, b) => (b.steamMarket.stats.maxPriceYear - b.steamMarket.price) - (a.steamMarket.stats.maxPriceYear - a.steamMarket.price))
            case "customFormulaSorting": return arr.sort((a, b) => ((b.steamMarket.stats.minPriceYear / (b.steamMarket.price / 100)) + (b.steamMarket.stats.averagePriceYear / (b.steamMarket.price / 100))) - ((a.steamMarket.stats.minPriceYear / (a.steamMarket.price / 100)) + (a.steamMarket.stats.averagePriceYear / (a.steamMarket.price / 100))))
            default: return arr;
        }
    }

    // FIRST RENDER
    useEffect(() => {
        data?.length && setSort([...data]?.sort((a, b) => (b.steamMarket.stats.averagePriceYear / (b.steamMarket.price / 100)) - (a.steamMarket.stats.averagePriceYear / (a.steamMarket.price / 100))));
    }, [data]);

    return (
        <div className="container mb-10">
            <h1 className='text-2xl font-bold mb-5'>РЕЙТИНГ ПРЕДМЕТОВ</h1>
            <form onSubmit={handleSubmit} onReset={handleReset} className="border-b border-neutral-800 pb-5 mb-5">
                <section className="grid grid-cols-5 gap-5 mb-5">
                    <div className="flex flex-col gap-1">
                        <span className="pl-1 text-xs text-neutral-300">Мин. цена ₽</span>
                        <Input id="minPrice" type="number" onChange={(event) => filters.current.minPrice = parseInt(event.target.value)} className="text-sm" placeholder="50" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="pl-1 text-xs text-neutral-300">Макс. цена ₽</span>
                        <Input type="number" onChange={(event) => filters.current.maxPrice = parseInt(event.target.value)} className="text-sm" placeholder="100" />
                    </div>


                    <div className="flex flex-col gap-1">
                        <span className="pl-1 text-xs text-neutral-300">Мин. профит %</span>
                        <Input type="number" onChange={(event) => filters.current.minProfit = parseInt(event.target.value)} className="text-sm" placeholder="150" />
                    </div>


                    <div className="flex flex-col gap-1">
                        <span className="pl-1 text-xs text-neutral-300">Мин. кол-во продаж</span>
                        <Input type="number" onChange={(event) => filters.current.minAvgSellQ = parseInt(event.target.value)} className="text-sm" placeholder="10" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="pl-1 text-xs text-neutral-300">Мин. ср цена</span>
                        <Input type="number" onChange={(event) => filters.current.minAvgPrice = parseInt(event.target.value)} className="text-sm" placeholder="325" />
                    </div>
                </section>

                <div className="flex gap-3">
                    <Button type="submit" size={"sm"} >Применить</Button>
                    <Button type="reset" variant={"destructive"} size={"sm"} >Очистить</Button>
                </div>
            </form>

            <section className="grid grid-cols-5 gap-5 mb-10">
                <Button variant={`${sortType == 'bestByAveragePricePercentage' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "bestByAveragePricePercentage"))}> Лучшие по ср. стоимости %</Button>
                <Button variant={`${sortType == 'worstByAveragePricePercentage' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "worstByAveragePricePercentage"))}> Худшие по ср. стоимости %</Button>
                <Button variant={`${sortType == 'closestToLowerBoundsPercentage' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "closestToLowerBoundsPercentage"))}> Макс. близкая к низам % </Button>
                <Button variant={`${sortType == 'closestToUpperBoundsPercentage' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "closestToUpperBoundsPercentage"))}> Макс. близкая к верхам %</Button>
                <Button variant={`${sortType == 'farthestFromUpperBoundsInRubles' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "farthestFromUpperBoundsInRubles"))}> Макс. далекая от верхов в руб.</Button>
                <Button variant={`${sortType == 'customFormulaSorting' ? "default" : "outline"}`} size={"sm"} onClick={() => sort && setSort(sorting([...sort], "customFormulaSorting"))}>Лучшие варианты</Button>
            </section>

            {data && sort ? <>
                <h3 className="text-lg font-semibold mb-5">Всего предметов: {sort.length}</h3>
                <ul className='grid grid-cols-1 gap-3'>
                    {sort?.slice(0, 50).map((item, index) => (
                        <li key={item.itemName} className={`${(item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100)) > 100 ? 'from-green-600/10' : 'from-rose-600/10'} to-70% bg-gradient-to-r border border-secondary rounded-xl p-3`}>
                            <Link to={`/item/${item._id}`} className="flex gap-5 items-center">
                                <div className="relative flex items-center justify-center min-w-[70px] min-h-[70px] w-[70px] h-[70px] rounded-lg overflow-hidden">
                                    <img src={item.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
                                    <div className='absolute bottom-1 right-1 flex justify-center items-center bg-white text-black min-w-[20px] min-h-[20px] p-1 rounded-lg text-xs font-semibold leading-3'>
                                        {index + 1}
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start gap-2 flex-1'>
                                    <div className="flex-start items-center">
                                        <h2 className='font-medium text-sm text-neutral-400'>{item.heroName} ∙ {item.itemName}</h2>
                                        {item.steamMarket.data.byWeeksData.length < 48 && <QuestionMarkCircledIcon className="stroke-rose-300" />}
                                    </div>

                                    <div className="grid grid-cols-7 font-medium leading-4 items-center justify-center">
                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className={`text-xs text-neutral-400`}>Разница</p>
                                            <p className={`text-lg font-semibold ${(item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100)) >= 100 ? 'text-green-400' : 'text-rose-400'}`}>{Math.round(item.steamMarket.stats.averagePriceYear / (item.steamMarket.price / 100)) - 100}%</p>
                                        </div>

                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className='text-xs text-neutral-400'>Цена</p>
                                            <p className='text-lg font-semibold'> {item.steamMarket.price}₽</p>
                                        </div>

                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className='text-xs text-neutral-400'>Ср. цена</p>
                                            <p className='text-lg font-semibold'> {item.steamMarket.stats.averagePriceYear} ₽</p>
                                        </div>

                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className='text-xs text-neutral-400'>Мин. за год</p>
                                            <p className='text-lg font-semibold'> {item.steamMarket.stats.minPriceYear} ₽</p>
                                        </div>

                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className='text-xs text-neutral-400'>Макс. за год</p>
                                            <p className='text-lg font-semibold'> {item.steamMarket.stats.maxPriceYear} ₽</p>
                                        </div>

                                        <div className='border-l border-neutral-800 pl-3'>
                                            <p className='text-xs text-neutral-400'>Продаж в ср.</p>
                                            <p className='font-semibold text-base'> {item.steamMarket.stats.averageSalesYear}</p>
                                        </div>

                                        <div className={`border-l pl-3 ${userItemsQuery && userItemsQuery.filter((entry: IFetchGetUserOwnedItems) => entry.itemId == item._id).length > 0 ? 'border-green-600' : 'border-neutral-800'}`}>
                                            <p className='text-xs text-neutral-400'>Имеется</p>
                                            <p className='font-semibold text-base'> {userItemsQuery && userItemsQuery.filter((entry: IFetchGetUserOwnedItems) => entry.itemId == item._id).reduce((acc: number, value: IFetchGetUserOwnedItems) => acc + value.quantity, 0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>))}
                </ul>
            </>
                : <p> Loading.. </p>
            }
        </div>
    )
}

export default ItemsRating