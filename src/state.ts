import {readable} from 'svelte/store'


export const mousePos = readable({x:0,y:0}, set => {

    let p = {x:0,y:0}
    let gl = document.querySelector("#GL")
    let canvas = gl.children[1];

    gl.addEventListener("pointermove",e => {
        // gregg mann method
        const rect = canvas.getBoundingClientRect();
        p.x = e["clientX"] - rect.left;
        p.y = e["clientY"] - rect.top;
        set(p);
    });

    return function stop(){}
});

