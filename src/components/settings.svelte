
<section id="settings">

</section>

<script>

    import {onMount} from 'svelte'

    window["settings"] = {
        fillStyle:"#000",
        strokeStyle:"#000",
        lineWidth:4,
        decayRate:0.001,
        capsOn:false,
        customCap:true
    }

    onMount(()=>{


        if(document.querySelectorAll(".dg").length <= 0){
            const gui = new dat.GUI({
                width:350
            });

            // add line width
            gui.add(window["settings"],"lineWidth",1,10);

            // add color options
            let palette = {
                color: [255,0,0]
            }

            // add line / stroke color
            let c = gui.addColor(palette, 'color');
            let isMouseDown = false;


            gui.add(window["settings"],"capsOn").name("Toggle default line endcaps")
            gui.add(window["settings"],"customCap").name("Toggle custom line endcaps")

            // add line decay rate
            //gui.add(window["settings"],"decayRate",0.0000001,0.01,0.001);

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


        }



    })

</script>