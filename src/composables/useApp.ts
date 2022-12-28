import { Application } from 'pixi.js'
import { useStageStore } from "@/store/useStageStore"

export default function useApp({ router }) {
    const app = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#334155',
    })

    const initiated = ref(false)

    const mount = () => {
        // @ts-ignore
        useCurrentElement().value.appendChild(app.view)
    }

    const init = () => {
        const stage = useStageStore()

        stage.init({
            app,
            router,
        })

        stage.start()

        initiated.value = true
    }

    const destroy = () => {
        const stage = useStageStore()
        stage.destroy()
    }

    return {
        app,
        initiated,
        //
        mount,
        init,
        destroy,
    }
}