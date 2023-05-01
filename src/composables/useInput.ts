import type { Input } from "@/types"

export default function useInput() {
    const input: Input = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        space: 0,
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            input.up = 1
        }
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            input.down = 1
        }
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            input.left = 1
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            input.right = 1
        }
        if (event.code === 'Space') {
            input.space = 1
        }
    }

    const onKeyUp = (event: KeyboardEvent) => {
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            input.up = 0
        }
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            input.down = 0
        }
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            input.left = 0
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            input.right = 0
        }
        if (event.code === 'Space') {
            input.space = 0
        }
    }

    const listenToKeyboard = () => {
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
    }

    const destroy = () => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
    }

    return {
        input,
        //
        listenToKeyboard,
        destroy,
    }
}
