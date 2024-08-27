import { Button } from '@/components/ui/button';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useSelector } from 'react-redux';
import { IUserItem, RootState } from '@/types/types';
import StatFrame from '@/components/shared/StatFrame';
import CreateUserSellItem from '@/components/forms/CreateUserSellItemForm';
import { useDeleteItemMutation, useGetItemsQuery } from '@/store/queries/userOwnedItemsApi';

type sortType = {
  sortBy: "none" | "profit" | "buyPrice" | "currentPrice" | "percentProfit";
  sortOrderAsc: boolean;
}

const MyItems = () => {
  // STATES
  const [searchField, setSearchField] = useState('');
  const [sort, setSort] = useState<sortType>({
    sortBy: "profit",
    sortOrderAsc: false
  });

  // SELECTORS
  const userData = useSelector((store: RootState) => store.user.data);

  const { data: items, isSuccess, isError } = useGetItemsQuery(userData!._id);
  const [deleteItemFromUser] = useDeleteItemMutation();

  // FUNCTIONS
  const sortingFn = (): IUserItem[] => {
    switch (sort.sortBy) {
      case "profit": {
        if (sort.sortOrderAsc) return [...items].sort((a: IUserItem, b: IUserItem) => (a.itemInfo.currentPrice / 100 * 87 - a.buyPrice) - (b.itemInfo.currentPrice / 100 * 87 - b.buyPrice));
        else return [...items].sort((a, b) => (b.itemInfo.currentPrice / 100 * 87 - b.buyPrice) - (a.itemInfo.currentPrice / 100 * 87 - a.buyPrice));
      }
      case "buyPrice": {
        if (sort.sortOrderAsc) return [...items].sort((a: IUserItem, b: IUserItem) => (a.buyPrice) - (b.buyPrice));
        else return [...items].sort((a: IUserItem, b: IUserItem) => (b.buyPrice) - (a.buyPrice));
      }
      case "currentPrice": {
        if (sort.sortOrderAsc) return [...items].sort((a: IUserItem, b: IUserItem) => (a.itemInfo.currentPrice) - (b.itemInfo.currentPrice));
        else return [...items].sort((a: IUserItem, b: IUserItem) => (b.itemInfo.currentPrice) - (a.itemInfo.currentPrice));
      }
      case "percentProfit": {
        if (sort.sortOrderAsc) return [...items].sort((a: IUserItem, b: IUserItem) => (a.itemInfo.currentPrice / (a.buyPrice / 100) / 100 * 87) - (b.itemInfo.currentPrice / (b.buyPrice / 100) / 100 * 87));
        else return [...items].sort((a: IUserItem, b: IUserItem) => (b.itemInfo.currentPrice / (b.buyPrice / 100) / 100 * 87) - (a.itemInfo.currentPrice / (a.buyPrice / 100) / 100 * 87));
      }
      default: return items;
    }
  }

  const onClickSort = (button: "none" | "profit" | "buyPrice" | "currentPrice" | "percentProfit") => {
    if (sort.sortBy == button) setSort((prev) => ({ ...prev, sortOrderAsc: !prev.sortOrderAsc }))
    else setSort((prev) => ({ ...prev, sortBy: button }))
  }

  // RENDER
  if (!isSuccess) return <h1 className="container text-center">Loading.. </h1>
  if (isError) return <h1 className="container text-center">Loading error! </h1>

  return (
    <div className='container'>
      {isSuccess && items ?
        <>
          <div className='flex justify-between'>
            <h1 className='text-2xl font-bold mb-5'>МОИ ПРЕДМЕТЫ</h1>
            <div className='flex items-center gap-2 bg-white px-1 rounded-md h-[30px]'>
              <MagnifyingGlassIcon strokeWidth='0.6' stroke='black' />
              <input
                className=" h-[25px] text-black rounded-md text-sm placeholder:text-xs placeholder:text-black bg-transparent outline-none"
                placeholder="Введите название.." type="text" value={searchField} onChange={(event) => setSearchField(event.target.value)} />
            </div>

          </div>
          <div className='grid grid-cols-4 gap-5 mb-10'>
            <StatFrame className='border-frame' title='Стоимость предметов' desc='Без учета комиссии' value={`${Math.round(items.reduce((acc: number, value: IUserItem) => acc + (value.itemInfo.currentPrice * value.quantity), 0))}₽`} />
            <StatFrame className='border-frame' title='Стоимость предметов' desc='С учетом коммиссии' value={`${Math.round(items.reduce((acc: number, value: IUserItem) => acc + (value.itemInfo.currentPrice * value.quantity), 0) / 100 * 87)}₽`} />
            <StatFrame className='border-frame' title='Всего потрачено' desc='На покупку предметов' value={`${Math.round(items.reduce((acc: number, value: IUserItem) => acc + (value.buyPrice * value.quantity), 0))}₽`} />
            <StatFrame className='border-frame' title='Всего предметов' desc='Имеется предметов всего' value={`${Math.round(items.reduce((acc: number, value: IUserItem) => acc + value.quantity, 0))}`} />
          </div>


          <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr_5%] ml-[72px] text-xs font-semibold mb-3 text-neutral-500 text-center'>
            <span>Название</span>
            <div>
              <Button variant={'outline'} size={'icon'} className={`w-3 h-3 mr-1 ${sort.sortBy == "profit" && 'text-white'}`} onClick={() => onClickSort("profit")}>
                {sort.sortOrderAsc ? "↓" : "↑"}
              </Button>
              <span>Чистая прибыль</span>
            </div>
            <div>
              <Button variant={'outline'} size={'icon'} className={`w-3 h-3 mr-1 ${sort.sortBy == "buyPrice" && 'text-white'}`} onClick={() => onClickSort("buyPrice")}>
                {sort.sortOrderAsc ? "↓" : "↑"}
              </Button>
              <span>Стоимость покупки</span>
            </div>
            <div>
              <Button variant={'outline'} size={'icon'} className={`w-3 h-3 mr-1 ${sort.sortBy == "currentPrice" && 'text-white'}`} onClick={() => onClickSort("currentPrice")}>
                {sort.sortOrderAsc ? "↓" : "↑"}
              </Button>
              <span>Текущая цена</span>
            </div>

            <div>
              <Button variant={'outline'} size={'icon'} className={`w-3 h-3 mr-1 ${sort.sortBy == "percentProfit" && 'text-white'}`} onClick={() => onClickSort("percentProfit")}>
                {sort.sortOrderAsc ? "↓" : "↑"}
              </Button>
              <span>Разница с комиссией</span>
            </div>
            
          </div>

          <ul className='grid grid-cols-1 rounded-lg gap-3'>
            {sortingFn().length > 0 && sortingFn()
              .filter((item) => item.itemInfo.itemName.toLowerCase().includes(searchField.toLowerCase()) || item.itemInfo.heroName.toLowerCase().includes(searchField.toLowerCase()))
              .map((item) => (
                <li key={item._id} className='border border-neutral-900 rounded-lg p-3'>
                  <div className="flex justify-between gap-5 items-center">
                    <div className='flex gap-5 items-center flex-1 relative'>

                      <Link to={`/item/${item.itemId}`} className='relative pr-1'>
                        <div className="flex items-center justify-center min-w-[50px] min-h-[50px] w-[50px] h-[50px] rounded-lg overflow-hidden">
                          <img src={item.itemInfo.imageUrl} alt="Описание изображения" className="object-cover w-[150%] h-[150%]" />
                          <div className='absolute top-0 right-0 flex justify-center items-center bg-white text-black min-w-[18px] min-h-[18px] p-1 rounded-md text-xs font-semibold leading-3'>
                            {item.quantity || 1}
                          </div>
                        </div>
                      </Link>

                      <div className='flex flex-col justify-start gap-2 flex-1'>
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] font-semibold leading-4 items-center justify-center text-center">
                          <div className='flex flex-col text-start border-l pl-5 border-neutral-400'>
                            <span className='font-medium text-sm text-neutral-500'>{item.itemInfo.heroName}</span>
                            <span className='font-medium text-base '>{item.itemInfo.itemName}</span>
                          </div>
                          <p className={`font-semibold text-lg ${(item.itemInfo.currentPrice / 100 * 87 - item.buyPrice) < 0 ? 'text-rose-400' : 'text-green-400'}`}>{Math.round(item.itemInfo.currentPrice / 100 * 87 - item.buyPrice)} ₽</p>
                          <p className='font-semibold text-lg'> {item.buyPrice} ₽</p>
                          <p className='font-semibold text-lg'>{item.itemInfo.currentPrice} ₽</p>
                          <p className='font-semibold text-lg'>{Math.round((item.itemInfo.currentPrice / (item.buyPrice / 100)) / 100 * 87) - 100}%</p>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-end justify-end gap-2'>
                      <CreateUserSellItem className='h-9 w-9' title={"$"} reqType='POST' item={item} />
                      <Button size={'icon'} variant={'outline'} onClick={() => deleteItemFromUser({ itemId: item._id })}>
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </>
        : <p> Not found</p>
      }
    </div >
  )
}

export default MyItems