

export default class Sketcher {

    el:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    animateId:number;
    settingsDirty:boolean = true;

    // positions saved unrolled, every 2 numbers should be considered one position.
    savedPositions:Array<number> = [];

    settings:any = {
        fillStyle:"#000",
        strokeSize:40,
        lineWidth:40,
        strokeStyle:"#000",

        // if true, on the next mouse down a straight line will be drawn from previous
        // mouse up to new mouse down position.
        snapToPoint:false
    };

    mouse:any = {
        x:0,
        y:0,
        lastX:0,
        lastY:0,
        isDown:false
    }

    frameCount:number = 0;
    constructor(el:HTMLCanvasElement) {

        this.el = el;

        this.el.width = window.innerWidth;
        this.el.height = window.innerHeight;
        this.ctx = this.el.getContext("2d");

        this._setupMouseListeners();
    }


    setIcon(){}

    setMousePosition(x=0,y=0){
        this.mouse.x = x;
        this.mouse.y = y;
    }



    clearPositions(){

        this.savedPositions = [];
    }

    start(){
        let ctx = this.ctx;
        let width = this.el.width;
        let height = this.el.height;
        let el = this.el;


        let animate = () => {
            requestAnimationFrame(animate);
            this.frameCount += 1;


            ctx.globalAlpha = 1;

            if(this.mouse.isDown){

                ctx.globalCompositeOperation = 'source-over';
                let lineWidth = window["settings"].lineWidth;
                let fillStyle = window["settings"].fillStyle;


                this.ctx.lineWidth = lineWidth;
                this.ctx.fillStyle = fillStyle;
                this.ctx.strokeStyle = window["settings"].strokeStyle;


                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.lastX,this.mouse.lastY);
                this.ctx.lineTo(this.mouse.x,this.mouse.y);
                this.ctx.stroke();
                this.ctx.closePath();

                // helps fill in the gaps since lineTo creates breaks with larger widths.
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x,this.mouse.y,lineWidth / 2,0,2 * Math.PI)
                this.ctx.fill();
                this.ctx.closePath();

                // save the positions
                this.savedPositions.push(this.mouse.x,this.mouse.y);

                this.mouse.lastX = this.mouse.x;
                this.mouse.lastY = this.mouse.y;
            }


        }



        // not smooth - also makes line segments obvious
        //setInterval(() => {
        //    this._resetCanvas();
        //},100);

        this.animateId = requestAnimationFrame(animate);

    }

    // ported from here
    //https://stackoverflow.com/questions/41483806/painting-in-canvas-which-fades-with-time-strange-alpha-layering-behaviour
    _resetCanvas(){
        let ctx = this.ctx;
        let width = this.el.width;
        let height = this.el.height;
        let frameCount = this.frameCount;



        let fade = () => {
            requestAnimationFrame(fade);
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "black";
            let r = Math.random() * 0.04;
            ctx.globalAlpha = (frameCount & 2 ? 0.16 : 0.08) + r;
            ctx.globalAlpha = r;
            ctx.fillRect(0,0,width,height);

            ctx.globalAlpha = 1;

            ctx.globalCompositeOperation = "source-over"


        }

        requestAnimationFrame(fade);
    }

    // from https://stackoverflow.com/questions/52878641/fastest-way-of-fading-out-entire-contents-of-a-canvas-to-transparency-not-other
    _fadeOut(){
        let fade = () => {
            requestAnimationFrame(fade);

            if(!this.mouse.isDown){
                let ctx = this.ctx;
                let fadeAmount = 0.2;
                // Note that the colour here doesn't matter! Only the alpha matters.
                // The colour here is red, but you'll see no red appear
                ctx.fillStyle = `rgba(255, 0, 0, ${1 - fadeAmount})`;
                ctx.globalCompositeOperation = 'destination-in';
                ctx.fillRect(0, 0, this.el.width,this.el.height);
                ctx.globalCompositeOperation = 'source-over';
            }
        }

        requestAnimationFrame(fade);
    }

    _setupMouseListeners(){
        this._fadeOut();
        window.addEventListener("mousedown", e => {

            e.preventDefault();
            if(!this.settings.snapToPoint){
                this.mouse.lastX = this.mouse.x;
                this.mouse.lastY = this.mouse.y;
            }

            this.mouse.isDown = true;
        })

        window.addEventListener("mousemove",e => {
        })

        window.addEventListener("mouseup", e => {

            this.mouse.isDown = false;


        })
    }

}