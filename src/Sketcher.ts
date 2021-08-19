

export default class Sketcher {

    el:HTMLCanvasElement;

    paths:Array<any> = [];

    mouse:any = {
        x:0,
        y:0
    }

    mouseDown:boolean = false;

    constructor(el) {
        let paper = window["paper"];

        this.el = el;
        paper.setup(this.el);
        this._setupListeners();
    }

    setMousePosition(x,y){
        this.mouse.x = x;
        this.mouse.y = y;
    }

    _setupListeners(){
        let paper = window["paper"];

        this.el.addEventListener("pointerdown", e => {

            // if statement to help ensure clicking on gui doesn't do anything.
            if(e.target["id"] === "CANVAS") {
                this.mouseDown = true;
                let path = new paper.Path();

                //path.moveTo(this.mouse.x,this.mouse.y);
                this.paths.push(path);
            }


        })

        this.el.addEventListener("pointermove", e => {
            let x = this.mouse.x ;
            let y = this.mouse.y;
            let paper = window["paper"];
            let currentPath = this.paths[this.paths.length - 1];

            if(this.mouseDown){

                let segment = new paper.Point(this.mouse.x,this.mouse.y);
                segment.lastX = this.mouse.lastX;
                segment.lastY = this.mouse.lastY;

                currentPath.add(segment);


            }
        })

        this.el.addEventListener("pointerup", e => {

            this.mouseDown = false;
            console.log(this.paths);
        })
    }

    start(){

        let opacity = 1;
        let paper = window["paper"];
        let paths = this.paths;



        let animate = () => {
            requestAnimationFrame(animate);

            paths.forEach(path => {
                path.strokeColor = "red";
                path.strokeWidth= 40;

                path.opacity -= 0.02;

            })

        }
        // Draw the view now:
        paper.view.draw();

        animate();


    }

}