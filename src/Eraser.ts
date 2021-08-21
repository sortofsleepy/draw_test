export default class Eraser {
    locations:Array<[number,number]> = [];

    currentPosition:any = {
        x:0,
        y:0
    }
    hasPointsToErase:boolean = false;
    listIndex:number = 0;
    init(locationList) {

        if(locationList.length > 0){
            this.locations = locationList;

            this.hasPointsToErase = true;
            this.currentPosition.x = this.locations[0][0];
            this.currentPosition.y = this.locations[0][1];
        }
    }

    render(ctx,lineWidth){

        if(this.locations.length > 0 && this.hasPointsToErase){

            ctx.globalCompositeOperation = "source-over"
            ctx.fillStyle = "rgba(0,0,0,0)"
            let size = 40
            let sizeHalf = size / 2;
            ctx.clearRect((this.currentPosition.x+20) - sizeHalf,(this.currentPosition.y+20) - sizeHalf,size,size);
            ctx.clearRect(this.currentPosition.x - sizeHalf,this.currentPosition.y - sizeHalf,size,size);
            ctx.clearRect((this.currentPosition.x-20) - sizeHalf,(this.currentPosition.y-20) - sizeHalf,size,size);
            //ctx.fillRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            //ctx.clearRect(this.currentPosition.x - 10,this.currentPosition.y - 10,230,230);
            this._update();
        }


    }

    _update(){
        if(this.listIndex + 1 < this.locations.length){
            this.listIndex += 1;
            this.currentPosition.x = this.locations[this.listIndex][0];
            this.currentPosition.y = this.locations[this.listIndex][1];
        }else{
            this.hasPointsToErase = false;
            this.locations = [];
        }
    }

}
