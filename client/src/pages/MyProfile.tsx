import { useSelector } from "react-redux"
import { RootState } from "@/types/types";
import { Link } from "react-router-dom";
import StatFrame from "@/components/shared/StatFrame";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useDeleteSalesHistoryMutation, useGetUserSalesHistoryQuery } from "@/store/queries/userSoldItemsApi";

const MyProfile = () => {
    // STATES
    const userData = useSelector((store: RootState) => store.user.data);

    // SELECTORS
    const { data, isSuccess, isError } = useGetUserSalesHistoryQuery(userData!._id);
    const [deleteSalesHistory] = useDeleteSalesHistoryMutation();

    // RENDER
    if (!isSuccess) return <h1 className="container text-center">Loading.. </h1>
    if (isError) return <h1 className="container text-center">Loading error! </h1>

    return (
        <div className='container'>
            {userData ?
                <>
                    <h1 className='text-2xl font-bold mb-5'>ИСТОРИЯ ПРОДАЖ</h1>
                    <div className='grid grid-cols-4 gap-5 mb-10'>
                        <StatFrame className={'border-frame'} title='Сумма проданных предметов' desc='С учетом коммиссии продажи' value={`${data && Math.round(data.reduce((acc, value) => acc + (value.sellPrice * value.quantity), 0) / 100 * 87) || 0}₽`} />
                        <StatFrame className={'border-frame'} title='Сумма купленных предметов' desc='За все время' value={`${data && Math.round(data.reduce((acc, value) => acc + (value.buyPrice * value.quantity), 0)) || 0}₽`} />
                        <StatFrame className={'border-frame'} title='Чистая прибыль' desc='С учетом коммиссии продажи' value={`${data && Math.round(data.reduce((acc, value) => acc + (value.sellPrice * value.quantity), 0) / 100 * 87 - (data.reduce((acc, value) => acc + (value.buyPrice * value.quantity), 0))) || 0}₽`} />
                        <StatFrame className={'border-frame'} title='Всего продано предметов' desc='За все время' value={`${data && data.reduce((acc, value) => acc + value.quantity, 0)}`} />
                    </div>


                    <div className='grid grid-cols-5 w-[1152px] ml-[72px] text-xs font-semibold mb-3 text-neutral-500 text-center'>
                        <span className='text-start'>Название</span>
                        <span>Чистая прибыль</span>
                        <span>Стоимость продажи</span>
                        <span>Стоимость покупки</span>
                        <span>Разница в процентах</span>
                    </div>
                    <ul className='grid grid-cols-1 border border-secondary rounded-lg'>
                        {data && data.map((item) => (
                            <li key={item._id} className='last:border-none border-b border-neutral-900 p-3'>
                                <div className="flex justify-between gap-5 items-center">
                                    <div className='flex gap-5 items-center flex-1'>

                                        <Link to={`/item/${item.itemId}`} className="relative pr-2" >
                                            <div className="flex items-center justify-center min-w-[40px] min-h-[40px] w-[40px] h-[40px] rounded-full overflow-hidden">
                                                <img src={item.itemInfo.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
                                                <div className='absolute top-0 right-0 flex justify-center items-center bg-white text-black w-[15px] h-[15px] rounded-full text-xs font-semibold leading-3'>
                                                    {item.quantity || 1}
                                                </div>
                                            </div>
                                        </Link>

                                        <div className='flex flex-col justify-start gap-2 flex-1'>
                                            <div className="grid grid-cols-5 font-semibold leading-4 items-center justify-center text-center">
                                                <div className='flex flex-col text-start'>
                                                    <span className='text-sm '>{item.itemInfo.itemName}</span>
                                                    <span className='text-xs text-neutral-500'>{item.itemInfo.heroName}</span>
                                                </div>
                                                <span className={`${((item.sellPrice * item.quantity) / 100 * 87 - (item.buyPrice * item.quantity)) < 0 ? 'text-rose-400' : 'text-green-400'}`}>{Math.round((item.sellPrice * item.quantity) / 100 * 87 - (item.buyPrice * item.quantity))} ₽</span>
                                                <span> {item.sellPrice} ₽ </span>
                                                <span> {item.buyPrice} ₽</span>
                                                <span>{Math.round(((item.sellPrice * item.quantity) / 100 * 87) / ((item.buyPrice * item.quantity) / 100)) - 100}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-end justify-end gap-2'>
                                        <Button size={'icon'} variant={'outline'} onClick={() => deleteSalesHistory({ itemId: item._id })}>
                                            <TrashIcon />
                                        </Button>
                                    </div>
                                </div>
                            </li>))}
                    </ul>
                </>
                : <span> Items not found</span>
            }
        </div >
    )
}

export default MyProfile