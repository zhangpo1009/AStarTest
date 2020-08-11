import AStarLocation from "./Location"
export default class MapBlock{
    //parent node
    private _parent:MapBlock = null;
    //postion in map
    private _location: AStarLocation = null;
    //block is reachable
    private _reachable:boolean = true;
    //cost to endPos
    private _heuristicCost:number = 0;
    //cost from startPos
    private _baseCost:number = 0;
    //uuid
    private _id:number = 0;
    //is path startpos
    private _isStartBlock = false;
    //is path endpos
    private _isEndBlock = false;

    set StartBlock(v){
        this._isStartBlock = v;
    }

    get StartBlock(){
        return this._isStartBlock;
    }

    set EndBlock(v){
        this._isEndBlock = v;
    }

    get EndBlock(){
        return this._isEndBlock;
    }

    get HeuristicCost(){
        return this._heuristicCost;
    }

    set HeuristicCost(v){
        this._heuristicCost = v; 
    }

    get BlockId(){
        return this._id;
    }

    set BlockId(v){
        this._id = v;
    }

    get BaseCost(){
        return this._baseCost;
    }

    set BaseCost(v){
        this._baseCost = v;
    }

    get TotalCost(){
        return this._heuristicCost + this._baseCost;
    }

    get Location(){
        return this._location;
    }

    set Location(v){
        this._location = v;
    }

    get Reachable(){
        return this._reachable;
    }

    set Reachable(v){
        this._reachable = v;
    } 

    incrBaseCost(v){
        this._baseCost += v;
    }

    set ParentBlock(p:MapBlock){
        this._parent = p;
    }

    get ParentBlock(){
        return this._parent;
    }
}
