

class DrawSegment {
    mouse:any = {
        x:0,
        y:0,
        lastX:0,
        lastY:0
    }

    color:Array<number> = [255,0,0];

    opacity:number = 1;

    constructor(x,y) {

        this.mouse.x = x;
        this.mouse.y = y;

    }

    render(ctx){
        ctx.beginPath();
        ctx.moveTo(this.mouse.lastX,this.mouse.lastY);
        ctx.lineTo(this.mouse.x,this.mouse.y);
        ctx.stroke();
        ctx.closePath();

        // helps fill in the gaps since lineTo creates breaks with larger widths.
        ctx.beginPath();
        ctx.arc(this.mouse.x,this.mouse.y,ctx.lineWidth / 2,0,2 * Math.PI)
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

    drawings:Array<DrawSegment> = [];

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

        let ctx = this.ctx;
        let render = () => {
            requestAnimationFrame(render);
            this._applyDrawSettings();


            if(this.mouse.isDown){


                this.drawings.forEach((draw,i) => {
                    draw.render(this.ctx);
                });


            }

            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;
        };

        this.animateId = requestAnimationFrame(render);
    }

    // TODO this should be per-segment settings rather than global
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
            let segment = new DrawSegment(this.mouse.x,this.mouse.y);
            segment.mouse.lastX = this.mouse.lastX;
            segment.mouse.lastY = this.mouse.lastY;

            this.drawings.push(segment);
        });

        window.addEventListener("pointermove",()=>{

            let x = this.mouse.x ;
            let y = this.mouse.y;

            if(this.mouse.isDown){

                let segment = this.drawings[this.drawings.length - 1];
                segment.mouse.lastX = this.mouse.lastX;
                segment.mouse.lastY = this.mouse.lastY;

                segment.mouse.x = x;
                segment.mouse.y = y;
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