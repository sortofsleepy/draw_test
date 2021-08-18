

class DrawInstance {
    x:number = 0;
    y:number = 0;
    lastX:number = 0;
    lastY:number = 0;
    opacity:number = 1;

    constructor(x,y) {

        this.x = x;
        this.y = y;

    }

    render(ctx){
        ctx.beginPath();
        ctx.moveTo(this.lastX,this.lastY);
        ctx.lineTo(this.x,this.y);
        ctx.stroke();
        ctx.closePath();

        // helps fill in the gaps since lineTo creates breaks with larger widths.
        ctx.beginPath();
        ctx.arc(this.x,this.y,ctx.lineWidth / 2,0,2 * Math.PI)
        ctx.fill();
        ctx.closePath();
    }
}

export default class Sketcher {

    el:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    animateId:number;

    mouse:any = {
        x:0,
        y:0,
        lastX:0,
        lastY:0,
        isDown:false
    }

    drawings:Array<DrawInstance> = [];

    constructor(el:HTMLCanvasElement) {

        this.el = el;

        this.el.width = window.innerWidth;
        this.el.height = window.innerHeight;
        this.ctx = this.el.getContext("2d");

        this._setupMouseListeners();
    }


    setMousePosition(x=0,y=0){
        this.mouse.x = x;
        this.mouse.y = y;
    }

    start(){

        let render = () => {
            requestAnimationFrame(render);
            this._applyDrawSettings();


            if(this.mouse.isDown){
                this.drawings.forEach((draw,i) => {
                    draw.render(this.ctx);
                });
            }

        };

        this.animateId = requestAnimationFrame(render);
    }

    _applyDrawSettings(){

        let lineWidth = window["settings"].lineWidth;
        let fillStyle = window["settings"].fillStyle;
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = window["settings"].strokeStyle;
    }

    _setupMouseListeners(){

        window.addEventListener("pointerdown",()=>{
            this.mouse.isDown = true;

        });
        window.addEventListener("pointermove",()=>{

            let x = this.mouse.x ;
            let y = this.mouse.y;

            if(this.mouse.isDown){
                this.drawings.push(new DrawInstance(x,y));
                let lastLastSet = this.drawings[this.drawings.length - 2];
                let lastSet = this.drawings[this.drawings.length - 1];


                if(lastLastSet !== undefined){
                    lastSet.lastX = lastLastSet.x;
                    lastSet.lastY = lastLastSet.y;
                }

            }

        });

        window.addEventListener("pointerup",()=>{
            this.mouse.isDown = false;


            /*
             // get the last drawing set and set the last x,y pos
            let lastSet = this.drawings[this.drawings.length - 1];
            lastSet.lastX = this.mouse.x;
            lastSet.lastY = this.mouse.y;
            this.drawings[this.drawings.length - 1] = lastSet;
             */


        });

    }
}