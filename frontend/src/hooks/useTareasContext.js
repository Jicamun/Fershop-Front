import { TareasContext } from "../context/TareaContext"
import { useContext } from "react"

export const useTareasContext = () => {
    const context = useContext(TareasContext)

    if (!context) {
        throw Error('useTareasContext must be used inside an TareasContextProvider')
    }

    return context
}