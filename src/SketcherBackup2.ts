

class DrawSegment {
    mouse:any = {
        x:0,
        y:0,
        lastX:0,
        lastY:0
    }

    settings:any = {
        lineWidth:3,
        fillStyle:"#000",
        strokeStyle:"#000"
    }

    color:Array<number> = [255,0,0];
    colorString:string = ""

    opacity:number = 1;

    // whether or not this segment should be purged
    shouldDelete:boolean = false;

    fade:boolean = false;

    constructor(x,y) {
        this.mouse.x = x;
        this.mouse.y = y;
        this.colorString = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.opacity})`
    }



    setColor(r,g,b){
        this.color[0] = r;
        this.color[1] = g;
        this.color[2] = b;
        this.colorString = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.opacity})`
    }
    setStrokeStyle(style){
        this.settings.strokeStyle = style;
    }

    setLineWidth(width){
        this.settings.lineWidth = width;
    }

    setFillStyle(style){
        this.settings.fillStyle = style;
    }
    render(ctx){

        let alpha = this.opacity
        if (this.fade) {
            alpha = this.opacity - .01
            this.opacity = alpha

        }

        this.opacity = 1;

        //// APPLY CURRENT SETTINGS /////
        let lineWidth = this.settings.lineWidth;
        let fillStyle = this.settings.fillStyle;
        let strokeStyle = this.settings.strokeStyle;


        ctx.lineWidth = lineWidth;

        //// START DRAWING /////
        ctx.beginPath();

        ctx.moveTo(this.mouse.lastX,this.mouse.lastY);
        ctx.lineTo(this.mouse.x,this.mouse.y);
        ctx.strokeStyle = `rgba(200,0,0,${this.opacity})`
        ctx.stroke();
        ctx.closePath();

        // helps fill in the gaps since lineTo creates breaks with larger widths.
        ctx.beginPath();

        ctx.fillStyle = `rgba(200,0,0,${this.opacity})`
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

        let render = () => {

            this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
            this.drawings.forEach((draw,i) => {
                draw.render(this.ctx);
            });



            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;
            requestAnimationFrame(render);
        };

        this.animateId = requestAnimationFrame(render);
    }

    _setupMouseListeners(){

        window.addEventListener("pointerdown",e =>{


            if(e.target["id"] === "CANVAS"){
                this.mouse.isDown = true;
                let segment = new DrawSegment(this.mouse.x,this.mouse.y);
                segment.mouse.lastX = this.mouse.lastX;
                segment.mouse.lastY = this.mouse.lastY;

                // get current drawing settings
                let lineWidth = window["settings"].lineWidth;
                let fillStyle = window["settings"].fillStyle;
                let strokeStyle = window["settings"].strokeStyle;

                segment.setLineWidth(lineWidth);
                segment.setFillStyle(fillStyle);
                segment.setStrokeStyle(strokeStyle)

                this.drawings.push(segment);
            }


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

            this.drawings[this.drawings.length - 1].fade = true;
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