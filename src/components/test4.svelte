

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


<script canvas="CANVAS">
    // based on

    import {onMount} from 'svelte'

    let canvas;
    onMount(() => {

        let ctx = canvas.getContext("2d");
        let paths = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        paper.setup(canvas);
        let opacity = 1;
        var lines = [
            {x:100, y:50,color:'red'},
            {x:250, y:150,color:'green'},
            {x:200, y:50,color:'gold'},
            {x:275, y:150,color:'blue'}
        ];



        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:


        let p1 = new paper.Path();
        p1.add(new paper.Point(100,50))
        p1.add(new paper.Point(300,90))
        p1.smooth();
        p1.closed = true;
        paths.push(p1);


        let p2 = new paper.Path();
        p2.closed = true;

        p2.add(new paper.Point(290,90))
        p2.add(new paper.Point(500,230))

        paths.push(p1);
        paths.push(p2);
        let animate = () => {
            requestAnimationFrame(animate);
            // Give the stroke a color
            paths.forEach(path => {
                path.strokeColor = `rgba(255,0,0,${opacity})`
                path.strokeWidth = 40;


            })

            opacity -= 0.005;

        }
        // Draw the view now:
        paper.view.draw();

        animate();
    });

    /*

        var path = new paper.Path();

        var start = new paper.Point(lines[0].x,lines[0].y);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:

        lines.forEach(line => {
            path.lineTo(line.x,line.y);
        })



        let animate = () => {
            requestAnimationFrame(animate);
            // Give the stroke a color
            path.strokeColor = `rgba(255,0,0,${opacity})`
            path.strokeWidth = 40;


            opacity -= 0.02;

        }
        // Draw the view now:
        paper.view.draw();

        animate();
     */
</script>
