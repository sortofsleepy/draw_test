export default class Eraser {
    locations:Array<any> = [];

    currentPosition:any = {
        x:0,
        y:0,
        angle:0
    }

    direction:string = ""
    hasPointsToErase:boolean = false;
    listIndex:number = 0;
    init(locationList) {

        if(locationList.length > 0){
            this.locations = locationList;
            this.listIndex = 0;
            this.hasPointsToErase = true;
            this.direction = this.locations[0].direction;
            this.currentPosition.x = this.locations[0].x;
            this.currentPosition.y = this.locations[0].y;
            this.currentPosition.angle = this.locations[0].angle;

        }
    }

    render(ctx,lineWidth){

        let random = Math.random;
        if(this.locations.length > 0 && this.hasPointsToErase){

            ctx.globalCompositeOperation = "source-over"
            ctx.fillStyle = "rgba(0,0,0,0)"
            let size = lineWidth
            let sizeHalf = lineWidth / 2;




            ctx.save();
            //ctx.globalCompositeOperation = "destination-out"

            ctx.fillStyle = `rgb(${random() * 255},${random() * 255},0)`
            if(this.direction === "left"){
                ctx.translate(this.currentPosition.x + sizeHalf,this.currentPosition.y + sizeHalf);
            }else{

                ctx.translate(this.currentPosition.x - sizeHalf,this.currentPosition.y - sizeHalf);
            }

            ctx.rotate(this.currentPosition.angle)

            // debug
            //ctx.fillRect(0,-15,size + 6,size + 30);
            ctx.clearRect(0,-15,size + 6,size + 30);
            ctx.restore();
            this._update();
        }


    }

    _update(){
        if(this.listIndex + 2 < this.locations.length){
            this.listIndex += 2;


            this.direction = this.locations[this.listIndex].direction;
            this.currentPosition.x = this.locations[this.listIndex].x;
            this.currentPosition.y = this.locations[this.listIndex].y;
            this.currentPosition.angle = this.locations[this.listIndex].angle

        }else{

            this.direction = ""
            this.hasPointsToErase = false;
            this.locations = [];
        }
    }

}
