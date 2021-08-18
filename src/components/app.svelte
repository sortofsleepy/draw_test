<main>

    <Settings/>
    <Content/>
    <canvas id="CANVAS" bind:this={canvas}></canvas>
</main>

<style>
    *{
        margin:0;
        padding:0;
    }

    canvas {
        position: absolute;
        top:0;
        left:0;
    }
</style>

<script>

    import {onMount} from 'svelte'
    import Sketcher from "../Sketcher";
    import Settings from "./settings.svelte"
    import Content from "./content.svelte"
    let canvas;
    let sketch;



    onMount(()=>{

        sketch = new Sketcher(canvas);
        sketch.start();

        canvas.addEventListener("pointermove", e => {
            const rect = canvas.getBoundingClientRect();
            let x = e["clientX"] - rect.left;
            let y = e["clientY"] - rect.top;
            sketch.setMousePosition(x,y);
        })


        canvas.addEventListener("mousedown", e=> {

        })

    })

</script>