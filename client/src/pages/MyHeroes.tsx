import { heroList, heroesAgilityList, heroesIntelligenceList, heroesStrengthList, heroesUniversalList } from "@/constants/heroList";
import { IUserItem, RootState } from "@/types/types";
import { useGetItemsQuery } from "@/store/queries/userOwnedItemsApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyHeroes = () => {
    // STATES
    const [data, setData] = useState<Map<string, number> | null>(null);

    // SELECTORS
    const userData = useSelector((store: RootState) => store.user.data);
    const { data: items, isError, isFetching } = useGetItemsQuery(userData!._id);

    // CONSTANTS
    const sumPercent: number = data ? Array.from(data.values()).reduce((acc, value) => acc + value, 0) / 100 : 0;

    // FIRST RENDER
    useEffect(() => {
        const result = new Map();

        items && items.map((item: IUserItem) => {
            if (result.has(item.itemInfo.heroName)) result.set(item.itemInfo.heroName, result.get(item.itemInfo.heroName) + (item.itemInfo.currentPrice * (item.quantity ? item.quantity : 1)));
            else result.set(item.itemInfo.heroName, item.itemInfo.currentPrice * (item.quantity ? item.quantity : 1));
        })

        setData(result);
    }, [items]);

    // RENDER
    if (isFetching) return <h1 className="container text-center">Loading.. </h1>
    if (isError) return <h1 className="container text-center">Loading error! </h1>

    return (
        <>
            <main className="container flex flex-col gap-5 mb-10 overflow-hidden">
                <div className="flex flex-col gap-1 border-b border-neutral-800 pb-5">
                    <h1 className="text-2xl font-bold">МОИ ГЕРОИ</h1>
                    <p className="text-sm text-neutral-400">• Куплено предметов на&nbsp;
                        <span className="font-semibold text-white">
                            {data?.size}&nbsp;
                        </span>
                        различных героя из&nbsp;
                        <span className="font-semibold text-white">
                            {heroList.length}
                        </span>
                    </p>
                    <p className="text-sm text-neutral-400">• Общая стоимость предметов:&nbsp;
                        <span className="font-semibold text-white">
                            {Math.round(sumPercent * 100)} ₽
                        </span>
                    </p>
                </div>


                <div className="border-b border-neutral-800 pb-10">
                    <p className="text-2xl font-bold mb-2 pl-3 text-red-600">СИЛА</p>
                    <ul className="grid grid-cols-9 gap-3 bg-gradient-to-tr from-red-600/10 p-2 rounded-xl">
                        {data && Array.from(data).filter(([heroName]) => heroesStrengthList.includes(heroName)).sort((a, b) => b[1] - a[1]).map(([heroName, value]) =>
                            <li key={heroName} className="border border-neutral-900 rounded-xl flex flex-col items-center py-2">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                                <span className="text-center text-sm font-semibold">{value} ₽</span>
                            </li>
                        )}

                        {data && heroesStrengthList.filter((hero) => !Array.from(data.keys()).includes(hero)).map((heroName) =>
                            <li className="border border-neutral-900 rounded-xl flex flex-col items-center py-2 grayscale">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="border-b border-neutral-800 pb-10">
                    <p className="text-2xl font-bold mb-2 pl-3 text-green-600">ЛОВКОСТЬ</p>
                    <ul className="grid grid-cols-9 gap-3 bg-gradient-to-tr from-green-600/10 p-2 rounded-xl">
                        {data && Array.from(data).filter(([heroName]) => heroesAgilityList.includes(heroName)).sort((a, b) => b[1] - a[1]).map(([heroName, value]) =>
                            <li key={heroName} className="border border-neutral-900 rounded-xl flex flex-col items-center py-2">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                                <span className="text-center text-sm font-semibold">{value} ₽</span>
                            </li>
                        )}

                        {data && heroesAgilityList.filter((hero) => !Array.from(data.keys()).includes(hero)).map((heroName) =>
                            <li className="border border-neutral-900 rounded-xl flex flex-col items-center py-2 grayscale">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="border-b border-neutral-800 pb-10">
                    <p className="text-2xl font-bold mb-2 pl-3 text-blue-600">ИНТЕЛЛЕКТ</p>
                    <ul className="grid grid-cols-9 gap-3 bg-gradient-to-tr from-blue-600/10 p-2 rounded-xl">
                        {data && Array.from(data).filter(([heroName]) => heroesIntelligenceList.includes(heroName)).sort((a, b) => b[1] - a[1]).map(([heroName, value]) =>
                            <li key={heroName} className="border border-neutral-900 rounded-xl flex flex-col items-center py-2">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                                <span className="text-center text-sm font-semibold">{value} ₽</span>
                            </li>
                        )}

                        {data && heroesIntelligenceList.filter((hero) => !Array.from(data.keys()).includes(hero)).map((heroName) =>
                            <li className="border border-neutral-900 rounded-xl flex flex-col items-center py-2 grayscale">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="border-b border-neutral-800 pb-10">
                    <p className="text-2xl font-bold mb-2 pl-3 ">УНИВЕРСАЛЬНОСТЬ</p>
                    <ul className="grid grid-cols-9 gap-3 bg-gradient-to-tr from-white/5 p-2 rounded-xl">
                        {data && Array.from(data).filter(([heroName]) => heroesUniversalList.includes(heroName)).sort((a, b) => b[1] - a[1]).map(([heroName, value]) =>
                            <li key={heroName} className="border border-neutral-900 rounded-xl flex flex-col items-center py-2">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                                <span className="text-center text-sm font-semibold">{value} ₽</span>
                            </li>
                        )}

                        {data && heroesUniversalList.filter((hero) => !Array.from(data.keys()).includes(hero)).map((heroName) =>
                            <li className="border border-neutral-900 rounded-xl flex flex-col items-center py-2 grayscale">
                                <div className="flex justify-center items-center h-[40px] mb-1">
                                    <i className={`d2mh ${heroName.toLowerCase().split(' ').join('_')}`} />
                                </div>
                                <span className="text-center text-xs text-neutral-400">{heroName}</span>
                            </li>
                        )}
                    </ul>
                </div>

            </main>
        </>
    )
}

export default MyHeroes