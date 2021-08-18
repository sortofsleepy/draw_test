

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

    frameCount:number = 0;
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

    }

    _setupMouseListeners(){

    }
}