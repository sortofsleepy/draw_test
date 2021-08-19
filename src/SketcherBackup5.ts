

class DrawSegment {
    mouse:any = {
        x:0,
        y:0,
        lastX:0,
        lastY:0
    }

    settings:any = {
        lineWidth:3,
        fillColor:[255,0,0],
        strokeColor:[255,0,0]
    }


    decayRate:number = 0.01;

    opacity:number = 1;

    // whether or not this segment should be purged
    shouldDelete:boolean = false;

    fade:boolean = false;

    constructor(x,y) {
        this.mouse.x = x;
        this.mouse.y = y;

    }



    setColor(r,g,b){
        this.settings.fillColor[0] = r;
        this.settings.fillColor[1] = g;
        this.settings.fillColor[2] = b;

        this.settings.strokeColor[0] = r;
        this.settings.strokeColor[1] = g;
        this.settings.strokeColor[2] = b;
    }

    setLineWidth(width){
        this.settings.lineWidth = width;
    }


    render(ctx){

        let alpha = this.opacity

        if(this.fade){
            alpha = this.opacity - this.decayRate;
            this.opacity = alpha


        }


        //// APPLY CURRENT SETTINGS /////
        let lineWidth = this.settings.lineWidth;
        let fillStyle = this.settings.fillStyle;
        let strokeStyle = this.settings.strokeStyle;


        ctx.strokeStyle = `rgba(${this.settings.strokeColor[0]},${this.settings.strokeColor[1]},${this.settings.strokeColor[2]},${this.opacity})`
        ctx.fillStyle = `rgba(${this.settings.fillColor[0]},${this.settings.fillColor[1]},${this.settings.fillColor[2]},${this.opacity})`
        ctx.lineWidth = lineWidth;

        //// START DRAWING /////
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

const defaultDecay = 0;

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
    decaySettings:Array<number> = [];

    styles:any = {
        fillStyle:"#000",
        strokeStyle:"#000",
        lineWidth:0
    }

    decayRateSettings:number = defaultDecay;

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

            // make sure we splice out any segments that have faded out already.
            this.drawings.forEach((drawing,i) => {
                if(drawing.opacity < 0){
                    this.drawings.splice(i,1)
                }
            })

            // render all remaining drawings.
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


            if(e.target["id"] === "CANVAS") {


                this.mouse.isDown = true;

                // apply current global styles
                for (let i in this.styles) {
                    this.styles[i] = window["settings"][i];
                }

            }


        });

        window.addEventListener("pointermove",()=>{

            let x = this.mouse.x ;
            let y = this.mouse.y;

            if(this.mouse.isDown){

                // decay increments from 0 to 1-ish.
                // we then store it cause we assign the values on mouse up,
                // we need to reverse first so we do it for this reason.
                // We can't start at 1 and go down because we might hit values < 0 otherwise.
                this.decayRateSettings += window["settings"]["decayRate"];
                this.decaySettings.push(this.decayRateSettings);

                let segment = new DrawSegment(this.mouse.x,this.mouse.y);
                segment.mouse.lastX = this.mouse.lastX;
                segment.mouse.lastY = this.mouse.lastY;

                segment.setLineWidth(this.styles.lineWidth);
                segment.setColor(
                    this.styles.fillStyle[0],
                    this.styles.fillStyle[1],
                    this.styles.fillStyle[2]
                )

                this.drawings.push(segment);

                segment = this.drawings[this.drawings.length - 1];
                segment.mouse.lastX = this.mouse.lastX;
                segment.mouse.lastY = this.mouse.lastY;

                segment.mouse.x = x;
                segment.mouse.y = y;
            }

        });

        window.addEventListener("pointerup",()=>{


            this.mouse.isDown = false;

            // set the decay settings
            this.decaySettings.reverse();

            this.decaySettings.forEach((itm,i) => {
                this.drawings[i].decayRate = itm
            })

            this.decaySettings = [];
            this.decayRateSettings = defaultDecay;


            // go through and slowly start to fade all the segments out
            this.drawings.forEach((drawing,i) => {
                drawing.fade = true;
            })


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