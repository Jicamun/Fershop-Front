import { useEffect, useState } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { DatePicker, Input, Select, Button } from 'antd';
import 'antd/dist/reset.css'



// Components
import { TareaDetailsWithTime} from '../components/TareaDetails'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Monitor = () => {
    const {dispatch} = useAuthContext()
    const {workers, dispatch: workersDispatch} = useWorkersContext()
    const {tareas, dispatch: tareasDispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { RangePicker } = DatePicker;   
    const { Option } = Select; 


    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);
    const [colorText, setColorText] = useState('');
    const [clientText, setClientText] = useState('');
    const [unitText, setUnitText] = useState('');



    useEffect(() => {

        if (user) { 
            fetchWorkers()
            fetchTareas()
        }
        
    }, [dispatch, tareasDispatch, workersDispatch, user])

    const fetchWorkers = async () => {          
        const response = await fetch( baseUrl + '/api/workers/', {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            workersDispatch({type: 'SET_WORKERS', payload: json})
        }
    }

    const fetchTareas = async () => {
        
        const stateObject = {
            selectedWorker,
            selectedStatus,
            startDate,
            endDate,
            colorText,
            clientText,
            unitText,
          };

        const filteredParams = Object.entries(stateObject)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

        const response = await fetch( baseUrl + `/api/tareas/all?${filteredParams}`, {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }            
        })
        const json = await response.json()

        if(response.ok){
            tareasDispatch({type:'SET_TAREAS', payload: json})
        }
    }

    const applyFilters = () => {
        fetchTareas()
    };

    const resetFilters = () => {
        setSelectedDateRange([]);  // O cualquier valor inicial que desees para las fechas
        setColorText('');
        setSelectedWorker(null);  // O cualquier valor inicial que desees para el trabajador
        setSelectedStatus(null);  // O cualquier valor inicial que desees para el status
        setClientText('');
        setUnitText('');
    };

    const formatDate = (date) => {
        const dateObject = new Date(date)

        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
    
        return `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;
      };

    const handleDateRangeChange = (dates) => {
        setSelectedDateRange(dates);
    
        if (dates && dates.length === 2) {
          setStartDate(formatDate(dates[0]));
          setEndDate(formatDate(dates[1]));
        } else {
          setStartDate('');
          setEndDate('');
        }

    }


    return(
        
        <div className="monitorInterface">
            <div className='filter-container'>
                <RangePicker
                    style={{width:'100%'}}
                    value={selectedDateRange}
                    onChange={handleDateRangeChange}
                    format="DD-MM-YYYY"
                />
                <Input
                    placeholder="Color"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                />
                <Select
                    placeholder="Trabajador"
                    value={selectedWorker}
                    onChange={(value) => setSelectedWorker(value)}
                >      
                    {workers?.map((worker) => (
                        <Option key={worker._id}> {worker.name} </Option>
                    ))}  
                </Select>
                <Select
                
                    placeholder="Status"
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value)}
                >
                    <Option value="0">Nueva</Option>
                    <Option value="1">En Proceso</Option>
                    <Option value="2">En Pausa</Option>
                    <Option value="3">Finalizada</Option>
                </Select>
                <Input
                    
                    placeholder="Cliente"
                    value={clientText}
                    onChange={(e) => setClientText(e.target.value)}
                />
                <Input
                    placeholder="Unidad"
                    value={unitText}
                    onChange={(e) => setUnitText(e.target.value)}
                />
                <Button 
                    type="primary" 
                    onClick={applyFilters}
                >
                    Aplicar Filtros
                </Button>
                <Button 
                    onClick={resetFilters}
                >
                    Reset Filtros
                </Button>
            </div>
            <div className='tareas'>
            <h1>Tareas</h1>
                {tareas?.map((tarea, worker) => (
                    <TareaDetailsWithTime key={tarea._id} tarea={tarea} worker={worker}/>
                ))}
            </div>
        </div>

    )
}

export default Monitor