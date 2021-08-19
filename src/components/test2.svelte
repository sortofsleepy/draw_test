<section>
    <canvas id="CANVAS" bind:this={canvas}></canvas>
</section>

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
    // based on
    //https://stackoverflow.com/questions/14058097/canvas-curved-line-without-breaks

    import {onMount} from 'svelte'
    let canvas;
    onMount(() => {

        let ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let drawings = [];


        let animate = () => {
            requestAnimationFrame(animate);

            drawings.forEach(drawing => {

                drawing.run();
            })
        }

        animate();
        // works if we just lineTo and stroke

        canvas.addEventListener("mousedown", e=> {
            canvas.isDrawing = true;
            canvas.lastX = e.pageX - canvas.offsetLeft;
            canvas.lastY = e.pageY - canvas.offsetTop;

            ctx.moveTo(canvas.lastX, canvas.lastY);
            ctx.beginPath();
            ctx.lineWidth = 30;
            //ctx.lineJoin = "round";
            ctx.strokeStyle = "rgba(255,255,0,0.1001)"


        })
        canvas.addEventListener("mousemove", e=> {
            if (!canvas.isDrawing) {
                return;
            }
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            //sctx.lineTo(x, y);
            //ctx.stroke();
            drawings.push({
                run(){

                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            })

            /*
              storing points doesn't work
              drawings.push({
                run(){
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            })
             */

            canvas.lastX = x;
            canvas.lastY = y;
        })
        canvas.addEventListener("mouseup", e=> {

            ctx.closePath();
            canvas.isDrawing = false;
        })
    })
</script>
