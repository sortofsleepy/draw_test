

<section bind:this={canvas}>

</section>

<style>
    *{
        margin:0;
        padding:0;
    }

    section {
        position: absolute;
        width:100vw;
        height:100vh;
        top:0;
        left:0;
        overflow: hidden;
    }

    
</style>


<script canvas="CANVAS">
    // based on

    import {onMount} from 'svelte'

    let canvas;

    let mouse = {
        x:0,
        y:0,
        lastX:0,
        lastY:0,
        isDown:false
    }


    onMount(() => {
        const two = new Two({
            width:window.innerWidth,
            height:window.innerHeight,
            type:Two.Types.webgl
        })
        two.appendTo(canvas);
        let rect = canvas.getBoundingClientRect();

        let drawings = [];

        let animate = ()=>{
            requestAnimationFrame(animate);


            drawings.forEach(path => {
                path.opacity -= 0.01;
            })


            two.update();
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;


        }

        animate();

        window.addEventListener("pointerdown",e => {

            mouse.isDown = true;


            console.log(drawings);
        })

        window.addEventListener("pointermove",e => {

            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;


            mouse.x = x;
            mouse.y = y;

            if(mouse.isDown){

                let curr = new Two.Vector(mouse.x,mouse.y);
                let last = new Two.Vector(mouse.lastX,mouse.lastY)


                let line = two.makeCurve([curr,last],true);
                line.noFill().stroke = "red";
                line.fill = "red";
                line.cap = "round"
                line.join = "bevel"
                line.linewidth = 10;
                line.curved = true;
                line.miter = 2;
                line.plot();
                drawings.push(line);
            }

        })

        window.addEventListener("pointerup",e => {
            mouse.isDown = false;
        })
    });
</script>
