<main>


    {#if testName === 0}

        <EraserTest/>
    {:else if testName === 1}
       <TwoJS/>
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
    import TwoJS from "./twojs.svelte"
    import Test7 from "./test7.svelte"
    import EraserTest from "./eraserTest.svelte"
    import Settings from "./settings.svelte"
    import Content from "./content.svelte"



    let searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());

    let testName = null
    if(params.hasOwnProperty("eraser")){
        testName = 0
    }else if(params.hasOwnProperty("two")){
        testName = 1;
    }


</script>