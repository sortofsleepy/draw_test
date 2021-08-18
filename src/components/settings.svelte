
<section id="settings">

</section>

<script>
    import * as dat from "dat.gui"
    import {onMount} from 'svelte'

    window["settings"] = {
        fillStyle:"#000",
        strokeStyle:"#000",
        lineWidth:40,


        // if true, on the next mouse down a straight line will be drawn from previous
        // mouse up to new mouse down position.
        snapToPoint:false
    }

    onMount(()=>{


        if(document.querySelectorAll(".dg").length <= 0){
            const gui = new dat.GUI();

            // add line width
            gui.add(window["settings"],"lineWidth",0,40);

            // add color options
            let palette = {
                color: '#FF0000'
            }

            let c = gui.addColor(palette, 'color');
            let isMouseDown = false;

            window.addEventListener("mousemove",() => {

                window["settings"].strokeStyle = palette["color"];
                window["settings"].fillStyle = palette["color"];
            })

            window.addEventListener("mousedown",()=> {
                isMouseDown = true;
            })

            window.addEventListener("mouseup",() => {
                isMouseDown = false;
            })

            let anim = () => {
                requestAnimationFrame(anim);

                if(window["settings"].globalAlpha > 0){
                    window["settings"].globalAlpha -= 0.3;
                }

                //console.log("global alpha is ", window.settings.globalAlpha);
            }

            anim();
        }



    })

</script>