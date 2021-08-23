<main>


    {#if useEraser === true}
        <EraserTest/>
    {:else}
        <Final/>
    {/if}

</main>

<style>
    *{
        margin:0;
        padding:0;
    }

    canvas {
        position: absolute;
        width:100vw;
        height:100vh;
        top:0;
        left:0;
    }
</style>

<script>

    import {onMount} from 'svelte'
    import Sketcher from "../Sketcher";
    import Final from "./final.svelte"
    import Test2 from "./test2.svelte"
    import Test3 from "./test3.svelte"
    import Test4 from "./test4.svelte"
    import Test6 from "./test6.svelte"
    import EraserTest from "./eraserTest.svelte"
    import Settings from "./settings.svelte"
    import Content from "./content.svelte"



    let searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());

    let useEraser = false;
    if(params.hasOwnProperty("eraser")){
        useEraser = true;
    }


</script>