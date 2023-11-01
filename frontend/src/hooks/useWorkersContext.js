import { WorkersContext } from "../context/WorkerContext"
import { useContext } from "react"

export const useWorkersContext = () => {
    const context = useContext(WorkersContext)

    if (!context) {
        throw Error('useWorkersContext must be used inside an WorkersContextProvider')
    }

    return context
}