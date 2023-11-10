import { useEffect, useState } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { DatePicker, Input, Select, Button } from 'antd';
import 'antd/dist/reset.css'


// Components
import {TareaDetails} from '../components/TareaDetails'
import {WorkerDetailsSmall} from '../components/WorkerDetails'

const Monitor = () => {
    const {dispatch} = useAuthContext()
    const {workers, dispatch: workersDispatch} = useWorkersContext()
    const {tareas, dispatch: tareasDispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { RangePicker } = DatePicker;   
    const { Option } = Select; 


    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [searchColor, setSearchColor] = useState('');
    const [clientText, setClientText] = useState('');
    const [unitText, setUnitText] = useState('');



    useEffect(() => {

        if (user) { 
            fetchWorkers()
            fetchTareas()
        }
        
    }, [dispatch, tareasDispatch, workersDispatch, user])

    const fetchWorkers = async () => {          
        const response = await fetch('/api/workers/', {
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
            selectedTarea,
            selectedDateRange,
            searchColor,
            clientText,
            unitText,
          };

        const filteredParams = Object.entries(stateObject)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

        console.log(selectedDateRange)

        const response = await fetch(`/api/tareas/all?${filteredParams}`, {
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
        setSearchColor('');
        setSelectedWorker(null);  // O cualquier valor inicial que desees para el trabajador
        setSelectedStatus(null);  // O cualquier valor inicial que desees para el status
        setClientText('');
        setUnitText('');
    };


    return(
        
        <div className="monitorInterface">

            <div className='filter-container'>
                    <RangePicker
                        value={selectedDateRange}
                        onChange={(dates) => setSelectedDateRange(dates)}
                        //format="DD-MM-YYYY"
                    />
                    <Input
                        placeholder="Color"
                        value={searchColor}
                        onChange={(e) => setSearchColor(e.target.value)}
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
                    <Button type="primary" onClick={applyFilters}>
                        Aplicar Filtros
                    </Button>
                    <Button onClick={resetFilters}>
                        Reset Filtros
                    </Button>
            </div>
            <div className='tareas'>
            <h1>Tareas</h1>
                {tareas?.map((tarea) => (
                    <TareaDetails key={tarea._id} tarea={tarea}/>
                ))}
            </div>
        </div>

    )
}

export default Monitor