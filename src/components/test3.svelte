

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
        var lines = [
            {x:100, y:50,color:'red'},
            {x:150, y:100,color:'green'},
            {x:200, y:50,color:'gold'},
            {x:275, y:150,color:'blue'}
        ];
        ctx.lineCap='round';
        ctx.lineJoint='round';

        var linewidth=20;

        for(var i=1;i<lines.length;i++){

            // calculate the smaller part of the line segment over
            //     which the gradient will run
            var p0=lines[i-1];
            var p1=lines[i];
            var dx=p1.x-p0.x;
            var dy=p1.y-p0.y;
            var angle=Math.atan2(dy,dx);
            var p0x=p0.x+linewidth*Math.cos(angle);
            var p0y=p0.y+linewidth*Math.sin(angle);
            var p1x=p1.x+linewidth*Math.cos(angle+Math.PI);
            var p1y=p1.y+linewidth*Math.sin(angle+Math.PI);



            // add the gradient color stops
            // and draw the gradient line from p0 to p1

            ctx.beginPath();
            ctx.moveTo(p0.x,p0.y);
            ctx.lineTo(p1.x,p1.y);
            ctx.strokeStyle="rgba(255,0,0,0.5)"
            ctx.lineWidth=linewidth;
            ctx.stroke();
        }
    });
</script>
