import { Application } from 'pixi.js'
import { useStageStore } from "@/store/useStageStore"

export default function useApp() {
    const app = new Application({ width: 800, height: 460, backgroundColor: '#334155' })

    const mount = () => {
        // @ts-ignore
        useCurrentElement().value.appendChild(app.view)
    }

    const init = () => {
        const stage = useStageStore()

        stage.init(app)
        stage.play()
    }

    return {
        app,
        //
        mount,
        init,
    }
}