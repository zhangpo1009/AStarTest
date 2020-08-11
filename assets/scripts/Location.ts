// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
    export default class AStarLocation{
        private _x:number = 0;
        private _y:number = 0;
    
        constructor(x:number, y:number){
            this._x = x;
            this._y = y;
        }
    
        get x(){
            return this._x;
        }
    
        get y(){
            return this._y;
        }
    
        Equal(other:AStarLocation):boolean{
            return (this._x == other.x) && (this._y == other.y);
        }
    }

