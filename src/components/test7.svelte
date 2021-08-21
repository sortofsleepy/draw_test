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

    import {onMount} from 'svelte'
    import Eraser from "../Eraser"
    let canvas;
    onMount(() => {

        let ctx = canvas.getContext("2d");
        let eraser = new Eraser();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let drawings = [];
        let rotAngles = [];

        let mouse = {
            x:0,
            y:0,
            lastX:0,
            lastY:0
        }

        let lineWidth = 10;

        let mouseDown = false;
        let animate = () => {
            requestAnimationFrame(animate);

            eraser.render(ctx,lineWidth)
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;

        }

        animate();
        // works if we just lineTo and stroke

        canvas.addEventListener("mousedown", e=> {
            mouseDown = true;

            drawings = [];

            ctx.beginPath();
            ctx.lineWidth = lineWidth;

        })
        canvas.addEventListener("mousemove", e=> {
            if (!mouseDown) {
                return;
            }
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            ctx.lineTo(x, y);
            ctx.stroke();

            mouse.x = x;
            mouse.y = y;


            drawings.push([x,y]);
        })

        function lerp(v0, v1, t) {
            return v0*(1-t)+v1*t
        }

        canvas.addEventListener("mouseup", e=> {

            if(mouseDown){
                ctx.closePath();


                // loop through and figure out erase points + angles
                let erasePoints = [];


                for(let i = 0; i < drawings.length; ++i){

                    if(drawings[i] !== undefined && drawings[i + 1] !== undefined){
                        let curr = drawings[i];
                        let next = drawings[i + 1];

                        // find as many possible values of x and y between current and next
                        let count = 0;
                        while(count !== 1){
                            let x = lerp(curr[0],next[0],count)
                            let y = lerp(curr[1],next[1],count)

                            let dx = next[0] - curr[0];
                            let dy = next[1] - curr[1];

                            let rot = Math.atan2(dy,dx);

                            erasePoints.push({
                                x:x,
                                y:y,
                                angle:rot
                            })
                            count += 0.2;

                            if(count >= 1){
                                break;
                            }

                        }


                    }

                }// end loop

                eraser.hasPointsToErase = true;
                eraser.init(erasePoints);


            }

            mouseDown = false;


        })
    })
</script>
