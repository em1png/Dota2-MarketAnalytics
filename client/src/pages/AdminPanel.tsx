import { Button } from '@/components/ui/button';
import { RootState } from '@/types/types';
import axios from '../axios';
import { useSelector } from 'react-redux';

const AdminPanel = () => {
    const userData = useSelector((store: RootState) => store.user.data);

    return (
        <div className='container'>
            {userData && userData.accessLevel == "admin" ?
                <div className='grid grid-cols-2 gap-10'>
                    <div className='grid grid-cols-3 gap-3'>
                        <Button variant={'outline'} onClick={() => axios.patch("/api/items")}>Обновить все предметы</Button>
                        <Button variant={'outline'} disabled> Добавить предмет </Button>
                        <Button variant={'outline'} disabled> Удалить предмет </Button>
                        <Button variant={'outline'} disabled> Обновить предмет ID </Button>
                    </div>
                    <div className='grid grid-cols-3 gap-3'>
                        <Button variant={'outline'} disabled> Найти пользователя </Button>
                        <Button variant={'outline'} disabled> Удалить пользователя</Button>
                        <Button variant={'outline'} disabled> Удалить предметы</Button>
                    </div>
                </div>
                : <h3 className='font-bold text-2xl text-red-400'>Access denied</h3>
            }
        </div>
    )
}

export default AdminPanel