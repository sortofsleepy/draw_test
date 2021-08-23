<svg width="960" height="500">
    <rect fill="#fff" width="100%" height="100%"></rect>
</svg>


<script>
    // based on
//https://bl.ocks.org/mbostock/f705fc55e6f26df29354
    import {onMount} from 'svelte'
    let canvas;


    onMount(() => {
        var line = d3.line()
            .curve(d3.curveBasis);

        let itms = [];

        var svg = d3.select("svg")
            .call(d3.drag()
                .container(function() { return this; })
                .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
                .on("start", dragstarted));

        function dragstarted() {
            let d = d3.event.subject;
            //let active = svg.append("path").datum(d)
            //let x0 = d3.event.x
            //let y0 = d3.event.y;


            d3.event.on("drag", function() {
                let active = svg.append("path").datum(d)
                let x0 = d3.event.x
                let y0 = d3.event.y;

                var x1 = d3.event.x,
                    y1 = d3.event.y,
                    dx = x1 - x0,
                    dy = y1 - y0;

                if (dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1]);
                else d[d.length - 1] = [x1, y1];
                active.attr("d", line);

                itms.push(active)
            });

            d3.event.on("end",function(){

                console.log(itms);
            })
        }

    })
</script>
