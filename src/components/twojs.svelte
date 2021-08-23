

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



    onMount(() => {
        const two = new Two({
            width:window.innerWidth,
            height:window.innerHeight,
            type:Two.Types.svg,
            autostart:true
        })
        two.appendTo(canvas);
        let rect = canvas.getBoundingClientRect();

        let mouseDown = false;
        let drawings = [];
        var x, y, line, mouse = new Two.Vector(), randomness = 2;
        two.bind('update',() => {
            drawings.forEach(path => {
                path.opacity -= 0.001;
            })
        })

        window.addEventListener("pointerdown",e => {

            mouseDown = true;
            mouse.set(e.clientX, e.clientY);
            line = null;

        })

        window.addEventListener("pointermove",e => {
            e.preventDefault();
            x = e.clientX;
            y = e.clientY;

            if(mouseDown){

                if (!line) {
                    var v1 = makePoint(mouse);
                    var v2 = makePoint(x, y);
                    line = two.makeCurve([v1, v2], true);
                    line.noFill().stroke = '#333';
                    line.linewidth = 10;
                    line.vertices.forEach(function(v) {
                        v.addSelf(line.translation);
                    });
                    line.translation.clear();

                } else {
                    var v1 = makePoint(x, y);
                    line.vertices.push(v1);
                }

                drawings.push(line);
            }
            mouse.set(x, y);
        })

        window.addEventListener("pointerup",e => {
            e.preventDefault();

            mouseDown = false;
        })
        function makePoint(x, y) {

            if (arguments.length <= 1) {
                y = x.y;
                x = x.x;
            }

            var v = new Two.Vector(x, y);
            v.position = new Two.Vector().copy(v);

            return v;

        }


    });
    /*
     onMount(() => {
        const two = new Two({
            width:window.innerWidth,
            height:window.innerHeight,
            type:Two.Types.svg,
            autostart:true
        })
        two.appendTo(canvas);
        let rect = canvas.getBoundingClientRect();

        let drawings = [];

        let animate = ()=>{
            requestAnimationFrame(animate);


            drawings.forEach(path => {
               // path.opacity -= 0.01;
            })




        }

        two.bind('update',() => {

            drawings.forEach(path => {
                 //path.opacity -= 0.01;
            })


            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
        }).play();
        animate();

        window.addEventListener("pointerdown",e => {

            mouse.isDown = true;
        })

        window.addEventListener("pointermove",e => {

            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;


            mouse.x = x;
            mouse.y = y;

            if(mouse.isDown){

                let curr = new Two.Vector(mouse.x,mouse.y);
                let last = new Two.Vector(mouse.lastX,mouse.lastY)


                //let line = two.makeLine(curr.x,curr.y,last.x,last.y);
                let line = two.makeCurve([curr,last], true);

                line.noFill().stroke = '#333';
                line.linewidth = 6;
                line.vertices.forEach(function(v) {
                    v.addSelf(line.translation);
                });
                line.translation.clear();

                line.noFill();

                drawings.push(line);

            }

        })

        window.addEventListener("pointerup",e => {
            mouse.isDown = false;
        })
    });
     */
</script>

