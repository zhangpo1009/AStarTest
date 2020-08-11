import AStarLocation from "./Location"
import MapBlock from "./MapBlock"

export default class MapManager{

    static MAPSIZE = {
        WIDTH:100,
        HEIGHT:100,
    };

    static D = 1;

    private startPos:AStarLocation = null;
    private endPos:AStarLocation = null;
    private Maps:Array<Array<MapBlock>> = null;
    private _path:Array<MapBlock> = null;;
    get path(){
        return this._path;
    }

    initMapInfo(){
        let id = 0;
        this.Maps = new Array<Array<MapBlock>>();
        for(let i=0; i<MapManager.MAPSIZE.WIDTH; i++)
        {
            this.Maps[i] = new Array<MapBlock>();
            for(let j=0; j<MapManager.MAPSIZE.HEIGHT; j++){
                this.Maps[i][j] = new MapBlock();
                this.Maps[i][j].BlockId = id;
                this.Maps[i][j].Location = new AStarLocation(i,j);
                id++;
            }
        }
        this.Maps[2][0].Reachable = false;
        this.Maps[2][1].Reachable = false;
        this.Maps[8][0].Reachable = false;
        this.Maps[7][0].Reachable = false;
        this.Maps[7][1].Reachable = false;
        this.Maps[8][1].Reachable = false;

        this.Maps[0][3].Reachable = false;
        this.Maps[1][3].Reachable = false;
        this.Maps[2][3].Reachable = false;

        this.Maps[1][7].Reachable = false;
        this.Maps[2][7].Reachable = false;
        this.Maps[3][7].Reachable = false;
        this.Maps[4][7].Reachable = false;
        this.Maps[5][7].Reachable = false;
        this.Maps[6][7].Reachable = false;
        this.Maps[7][7].Reachable = false;
        this.Maps[8][7].Reachable = false;


        this.Maps[0][5].Reachable = false;
        this.Maps[1][5].Reachable = false;
        this.Maps[2][5].Reachable = false;
        this.Maps[4][5].Reachable = false;
        this.Maps[6][5].Reachable = false;
        this.Maps[7][5].Reachable = false;

    }
    
    getBlock(pos:AStarLocation):MapBlock{
        if(pos.x<0||pos.x>MapManager.MAPSIZE.WIDTH-1||pos.y<0||pos.y>MapManager.MAPSIZE.HEIGHT-1) return null;
        return this.Maps[pos.x][pos.y];
    }

    //four directions
    getHeuristicCost(t1:MapBlock,t2:MapBlock):number{
        let dx = Math.abs(t2.Location.x-t1.Location.x);
        let dy = Math.abs(t2.Location.y-t1.Location.y);
        return MapManager.D*(dx+dy);
    }

    //eight directions
    getHeuristicCost8(t1:MapBlock,t2:MapBlock):number{
        let dx = Math.abs(t2.Location.x-t1.Location.x);
        let dy = Math.abs(t2.Location.y-t1.Location.y);
        return MapManager.D*(dx+dy)+(Math.SQRT2-2)*MapManager.D*Math.min(dx,dy);
    }

    setPathStartPosAndEndPos(start:AStarLocation, end:AStarLocation){
        if(start.Equal(end)){
            console.log("#####startpos cannot be same with endpos");
            return;
        }
        this.startPos = start;
        this.endPos = end;
        this.Maps[this.startPos.x][this.startPos.y].StartBlock = true;
        this.Maps[this.endPos.x][this.endPos.y].EndBlock = true;
    }

    makePath(lastBlock:MapBlock){
        if(this._path){
            this._path.length = 0;
        }
        else{
            this._path = new Array<MapBlock>();
        }
        let t = lastBlock;

        while(t){
            this._path.push(t);
            t = t.ParentBlock;
        }

        this._path.reverse();
    }
    
    searchPath()
    {
        let d = new Date(); 
        console.log("start time"+d.getSeconds()+"."+d.getMilliseconds());
        let openset = new Array<MapBlock>();
        let closedset = new Array<MapBlock>();

        let startBlock = this.getBlock(this.startPos);
        let endBlock = this.getBlock(this.endPos);
        openset.push(startBlock);

        let t: MapBlock= null;
        let direction = new Array<MapBlock>();
        let directionX = new Array<MapBlock>();

        while(1){
            if(openset.length === 0){
                console.log("###parse error");
                return false;
            }

            for(let item in openset){
                if(openset[item].EndBlock){
                    this.makePath(openset[item]);        
                    console.log("#####finish the parse!!!");
                    let d = new Date(); 
                    console.log("end time"+d.getSeconds()+"."+d.getMilliseconds());
                    return true;
                }
            }
            let priorty = Infinity;
            for(let item in openset){
                let tempItem = openset[item];
                let h = this.getHeuristicCost8(tempItem, endBlock);

               if(h + tempItem.BaseCost < priorty){
                    priorty = h+tempItem.BaseCost;
                    t = openset[item];
               }
            }

            let index = openset.indexOf(t);
            if(index > -1) openset.splice(index,1);
            closedset.push(t);

            let left = this.getBlock(new AStarLocation(t.Location.x-1,t.Location.y));
            let right = this.getBlock(new AStarLocation(t.Location.x+1,t.Location.y));
            let top = this.getBlock(new AStarLocation(t.Location.x,t.Location.y+1));
            let bottom = this.getBlock(new AStarLocation(t.Location.x,t.Location.y-1));

            let lefttop = this.getBlock(new AStarLocation(t.Location.x-1,t.Location.y+1));
            let righttop = this.getBlock(new AStarLocation(t.Location.x+1,t.Location.y+1));
            let leftbottom = this.getBlock(new AStarLocation(t.Location.x-1,t.Location.y-1));
            let rightbottom = this.getBlock(new AStarLocation(t.Location.x+1,t.Location.y-1));

            direction[0] = left;
            direction[1] = right;
            direction[2] = top;
            direction[3] = bottom;

            for(let item in direction)
            {
                let block = direction[item];
                if(block && block.Reachable){
                    let index = closedset.indexOf(block);
                    if(index< 0){
                        let index = openset.indexOf(block);
                        if(index > -1)
                        {
                            //一个节点的getHeuristicCost8一致不变的
                            //let hcost = this.getHeuristicCost8(block,endBlock);
                            //if(block.BaseCost + block.HeuristicCost > t.BaseCost + MapManager.D + hcost){
                            if(block.BaseCost > t.BaseCost + MapManager.D ){
                                block.ParentBlock = t;
                                block.BaseCost = t.BaseCost + MapManager.D;
                                //block.HeuristicCost = hcost;
                            }
                        }
                        else{
                            let hcost = this.getHeuristicCost8(block,endBlock);
                            block.ParentBlock = t;
                            block.BaseCost = t.BaseCost + MapManager.D;
                            block.HeuristicCost = hcost;
                            openset.push(block);
                        }
                    } 
                }
            }

            directionX[0] = lefttop;
            directionX[1] = righttop;
            directionX[2] = leftbottom;
            directionX[3] = rightbottom;

            for(let item in directionX)
            {
                let block = directionX[item];
                if(block && block.Reachable){
                    let index = closedset.indexOf(block);
                    if(index< 0){
                        let index = openset.indexOf(block);
                        if(index > -1)
                        {
                            //一个节点的getHeuristicCost8一致不变的
                            //let hcost = this.getHeuristicCost8(block,endBlock);
                            //if(block.BaseCost + block.HeuristicCost > t.BaseCost + MapManager.D + hcost){
                            if(block.BaseCost > t.BaseCost + MapManager.D*Math.SQRT2){
                                block.ParentBlock = t;
                                block.BaseCost = t.BaseCost + MapManager.D*Math.SQRT2;
                                //block.HeuristicCost = hcost;
                            }
                        }
                        else{
                            let hcost = this.getHeuristicCost8(block,endBlock);
                            block.ParentBlock = t;
                            block.BaseCost = t.BaseCost + MapManager.D*Math.SQRT2;
                            block.HeuristicCost = hcost;
                            openset.push(block);
                        }
                    } 
                }
            }
        }
    }
}
