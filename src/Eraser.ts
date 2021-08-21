export default class Eraser {
    locations:Array<any> = [];

    currentPosition:any = {
        x:0,
        y:0,
        angle:0
    }
    hasPointsToErase:boolean = false;
    listIndex:number = 0;
    init(locationList) {

        if(locationList.length > 0){
            this.locations = locationList;
            this.listIndex = 0;
            this.hasPointsToErase = true;
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
            let size = lineWidth + 20
            let sizeHalf = size / 2;



            ctx.save();
           // ctx.globalCompositeOperation = "destination-out"

            ctx.fillStyle = `rgb(${random() * 255},${random() * 255},0)`

            ctx.translate(this.currentPosition.x - sizeHalf,this.currentPosition.y - sizeHalf);
            ctx.rotate(this.currentPosition.angle)

            ctx.clearRect(0,0,30,40);
            //ctx.fillRect(0,0,30,40);
            ctx.restore();
            ctx.clearRect(this.currentPosition.x + sizeHalf,this.currentPosition.y + sizeHalf,size,size);

            ctx.clearRect(this.currentPosition.x - sizeHalf,this.currentPosition.y - sizeHalf,size,size);

            //ctx.clearRect((this.currentPosition.x+20) - sizeHalf,(this.currentPosition.y+20) - sizeHalf,size,size);
            //ctx.clearRect(this.currentPosition.x - sizeHalf,this.currentPosition.y - sizeHalf,size,size);
            //ctx.clearRect((this.currentPosition.x-20) - sizeHalf,(this.currentPosition.y-20) - sizeHalf,size,size);
            //ctx.fillRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            //ctx.clearRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            this._update();
        }


    }

    _update(){
        if(this.listIndex + 1 < this.locations.length){
            this.listIndex += 1;
            this.currentPosition.x = this.locations[this.listIndex].x;
            this.currentPosition.y = this.locations[this.listIndex].y;
            this.currentPosition.angle = this.locations[this.listIndex].angle
        }else{
            this.hasPointsToErase = false;
            this.locations = [];
        }
    }

}
