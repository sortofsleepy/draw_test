

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
            //this.opacity = alpha


        }


        //// APPLY CURRENT SETTINGS /////
        let lineWidth = this.settings.lineWidth;
        let fillStyle = this.settings.fillStyle;
        let strokeStyle = this.settings.strokeStyle;
        // try to "erase" the lines as the lines are drawn
        // to attempt to better hide things.
        setTimeout(()=>{
            let dx = this.mouse.x - this.mouse.lastX;
            let dy = this.mouse.y - this.mouse.lastY;

            let dx2 = dx + dx;
            let dy2 = dy + dy;

            //ctx.clearRect(this.mouse.lastX-(dx2 / 2), this.mouse.lastY - (dy2 / 2), dx2 * 2000, dy2)
            ctx.clearRect(this.mouse.lastX+(dx2 / 2), this.mouse.lastY + (dy2 / 2), dx2, dy2)
            ctx.clearRect(this.mouse.lastX-(dx2 / 2), this.mouse.lastY - (dy2 / 2), dx2, dy2)
            ctx.clearRect(this.mouse.x+(dx2 / 2), this.mouse.y + (dy2 / 2), dx2, dy2)
            ctx.clearRect(this.mouse.x-(dx2 / 2), this.mouse.y - (dy2 / 2), dx2, dy2)
        })


        // hiding caps for now
        if(window["settings"]["capsOn"]){
            ctx.lineCap = "round";
            ctx.lineJoin = "round"
        }else{
            ctx.lineCap = "butt";
            ctx.lineJoin = "round"
        }

        // reset settings
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = `rgba(${this.settings.strokeColor[0]},${this.settings.strokeColor[1]},${this.settings.strokeColor[2]},${this.opacity})`
        ctx.fillStyle = `rgba(${this.settings.fillColor[0]},${this.settings.fillColor[1]},${this.settings.fillColor[2]},${this.opacity})`
        ctx.lineWidth = lineWidth;

        //// START DRAWING /////

        ctx.beginPath();
        ctx.moveTo(this.mouse.lastX,this.mouse.lastY);
        ctx.lineTo(this.mouse.x,this.mouse.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineTo(this.mouse.x,this.mouse.y);
        ctx.moveTo(this.mouse.lastX,this.mouse.lastY);
        ctx.stroke();
        ctx.closePath();

        // turn on custom capping if capsOn if off.
        if(window["settings"]["customCap"]){

            let opac = 0.0;
            ctx.fillStyle = `rgba(${this.settings.fillColor[0]},${this.settings.fillColor[1]},${this.settings.fillColor[2]},${this.opacity -opac})`
            ctx.strokeStyle = `rgba(${this.settings.strokeColor[0]},${this.settings.strokeColor[1]},${this.settings.strokeColor[2]},${this.opacity-opac})`
            ctx.globalCompositeOperation = "overlay"

            ctx.beginPath();

            ctx.arc(this.mouse.x,this.mouse.y,(this.settings.lineWidth / 2),0,2 * Math.PI)
            ctx.fill();


            ctx.closePath();
        }

        //ctx.globalCompositeOperation = "source-over"
        /*
        ctx.beginPath();
        ctx.arc(this.mouse.x,this.mouse.y,ctx.lineWidth / 2,0,2 * Math.PI)
        ctx.fill();
        ctx.closePath();

         */

    }

}

class Eraser {
    locations:Array<DrawSegment> = [];

    currentPosition:any = {
        x:0,
        y:0
    }
    listIndex:number = 0;
    init(locationList) {

        if(locationList.length > 0){
            this.locations = locationList;

            this.currentPosition.x = this.locations[0].mouse.x;
            this.currentPosition.y = this.locations[0].mouse.y;
        }
    }

    render(ctx,lineWidth){

        if(this.locations.length > 0){

            ctx.globalCompositeOperation = "source-over"
            ctx.fillStyle = "rgba(0,0,0,1)"
            //ctx.clearRect(this.currentPosition.x - 10,this.currentPosition.y - 10,20,20);
            //ctx.fillRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            ctx.clearRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            this._update();
        }


    }

    _update(){
        if(this.listIndex + 1 < this.locations.length){
            this.listIndex += 1;
            this.currentPosition.x = this.locations[this.listIndex].mouse.x;
            this.currentPosition.y = this.locations[this.listIndex].mouse.y;
        }
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
    eraser:Eraser;
    constructor(el:HTMLCanvasElement) {

        this.el = el;

        this.el.width = window.innerWidth;
        this.el.height = window.innerHeight;
        //this.ctx = this.el.getContext("2d",{alpha:false});
        this.ctx = this.el.getContext("2d");


        this.eraser = new Eraser()
        this._setupMouseListeners();
    }


    setMousePosition(x=0,y=0){
        this.mouse.x = x;
        this.mouse.y = y;
    }


    start(){

        let render = () => {

           this.ctx.clearRect(0,0,this.el.width,this.el.height);


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


            this.eraser.render(this.ctx,this.styles.lineWidth);

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

            }

        });

        window.addEventListener("pointerup",()=>{


            this.mouse.isDown = false;
            ///////////////////////// GENERATE FADE SETTINGS ///////////////////////////////////
            // decay increments from 0 to 1-ish.
            // we then store it cause we assign the values on mouse up,
            // we need to reverse first so we do it for this reason.
            // We can't start at 1 and go down because we might hit values < 0 otherwise which seems to cause issues
            this.drawings.forEach(draw => {
                this.decayRateSettings += 1 / (this.drawings.length)
                this.decaySettings.push(this.decayRateSettings * 0.1);
            })

            // reverse so fastest first - latest mouse movement should be slower so put slower
            // values at the end.
            this.decaySettings.reverse();

            // boost the speed a bit of the last few items that need to fade
            // TODO longer line is longer it will take for last segments to fade, maybe need to limit line to some extent.
            this.decaySettings[this.decaySettings.length-1] += 0.001;
            this.decaySettings[this.decaySettings.length-2] += 0.0001;

            this.decaySettings.forEach((itm,i) => {
                this.drawings[i].decayRate = itm
            })

            ////////////////////////////////////////////////////////////

            // go through and slowly start to fade all the segments out
            this.drawings.forEach((drawing,i) => {

                // seems to help "slightly"
                /*
                  this.ctx.globalCompositeOperation = "screen"
                this.ctx.fillStyle = "rgba(255,255,255,0.2)"
                this.ctx.fillRect(drawing.mouse.lastX-15,drawing.mouse.lastY- 15,40,40)
                this.ctx.fillRect(drawing.mouse.x-15,drawing.mouse.y- 15,40,40)

                 */
                drawing.fade = true;
            })

            console.log(this.drawings);

            this.eraser.init(this.drawings);


            this.decaySettings = [];
            this.decayRateSettings = defaultDecay;

        });

    }
}