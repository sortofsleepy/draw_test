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
        top:0;
        left:0;
    }
</style>

<script>

    import {onMount} from 'svelte'
    let canvas;



    onMount(()=>{
        const drawings = []
        let mouseDown = false
        function draw() {
            // count++;

            const ctx = canvas.getContext('2d');
            const ww = window.innerWidth
            const wh = window.innerHeight
            canvas.width = ww * 2;
            canvas.height = wh * 2;
            canvas.style.width = `${ww}px`;
            canvas.style.height = `${wh}px`;
            ctx.scale(2, 2)
            ctx.clearRect(0, 0, ww, wh);
            drawings.forEach(drawing => {
                const { x, y, fade, opacity } = drawing
                let alpha = opacity
                if (fade) {
                    alpha = opacity - .01
                    drawing.opacity = alpha
                }
                if (x) {
                    x.forEach((n, i) => {
                        ctx.beginPath();
                        ctx.moveTo(x[i - 1], y[i - 1]);
                        ctx.lineTo(n, y[i]);
                        ctx.strokeStyle = `rgba(200, 0, 0, ${alpha})`;
                        ctx.lineWidth = 6;
                        ctx.lineCap = 'round';
                        ctx.stroke();
                        ctx.closePath();
                    })
                }
            })
            window.requestAnimationFrame(draw);
        }
        window.requestAnimationFrame(draw);
        window.addEventListener('mousedown', () => {
            mouseDown = true
            drawings.push({})
        })
        window.addEventListener('mouseup', () => {
            const l = drawings.length
            const targetDrawing = drawings[l - 1]
            if (targetDrawing) targetDrawing.fade = true
            mouseDown = false
            console.log(drawings);
        })
        window.addEventListener('mousemove', (e) => {
            if (mouseDown) {
                const { clientX: x, clientY: y } = e
                const d = drawings[drawings.length - 1]
                d.opacity = 1
                if (!d.x) d.x = [x]
                else d.x.push(x)
                if (!d.y) d.y = [y]
                else d.y.push(y)
            }
        })
    })

</script>