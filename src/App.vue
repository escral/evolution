<template>
    <div id="game" />
</template>

<script setup lang="ts">  
    // @ts-ignore
    import * as PIXI from 'pixi.js'

    const app = new PIXI.Application({ width: 640, height: 360, backgroundColor: '#FFF' })
    
    onMounted(() => {
        // @ts-ignore
        useCurrentElement().value.appendChild(app.view)

        const element  = new PIXI.Graphics()
        element.beginFill(0x000000)
        element.drawCircle(30, 30, 30)
        element.endFill()

        app.stage.addChild(element)

        // Add a ticker callback to move the sprite back and forth
        let elapsed = 0.0
        app.ticker.add((delta) => {
            elapsed += delta
            element.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
        })
    })
</script>