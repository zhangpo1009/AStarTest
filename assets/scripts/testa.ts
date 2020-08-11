import { sampleLog } from "../scripts/GlobalConfig";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import MapManager from "./MapManager"
import MapBlock from "./MapBlock";
import AStarLocation from "./Location"

@ccclass
export default class testa extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
@property(cc.Vec2)
startPos:cc.Vec2 = cc.v2(0,0);

@property(cc.Vec2)
EndPos:cc.Vec2 = cc.v2(0,0);


@property(cc.SpriteFrame)
sp:cc.SpriteFrame = null;

manager:MapManager = null;
    onLoad(){
        this.manager = new MapManager();
        this.manager.initMapInfo();
        this.manager.setPathStartPosAndEndPos(new AStarLocation(this.startPos.x, this.startPos.y),new AStarLocation(this.EndPos.x, this.EndPos.y));

        let maps = cc.find("MapsLayer",this.node);
        let s = maps.getContentSize().width/MapManager.MAPSIZE.WIDTH;
        maps.getComponent(cc.Layout).cellSize = new cc.Size(s,s);
        let temp = cc.find("MapsLayer1/New00",this.node);

        for(let i=0; i<MapManager.MAPSIZE.WIDTH; i++)
        for(let j=0; j<MapManager.MAPSIZE.HEIGHT; j++){
            let sp = cc.instantiate(temp);
            sp.name = `New${i}_${j}`;
            maps.addChild(sp);
        }
    }

    start () {
        this.manager.searchPath();
        this.drawpath(this.manager.path);
    }


    drawpath(path:Array<MapBlock>){
        let maps = cc.find("MapsLayer",this.node);

        for(let i=0; i<MapManager.MAPSIZE.WIDTH; i++)
        for(let j=0; j<MapManager.MAPSIZE.HEIGHT; j++){
           if(!this.manager.getBlock(new AStarLocation(i,j)).Reachable)
                maps.getChildByName(`New${i}_${j}`).color = cc.color(0,0,0);
            else
                maps.getChildByName(`New${i}_${j}`).color = cc.color(0,(i+100)%256,(j+100)%256);

        }

        maps.getChildByName(`New${this.startPos.x}_${this.startPos.y}`).color = cc.color(255,0,0);
        maps.getChildByName(`New${this.EndPos.x}_${this.EndPos.y}`).color = cc.color(0,0,255);

        let index = 0;
        for(let i in path)
        {
            if(path[i].StartBlock || path[i].EndBlock) continue;
            maps.getChildByName(`New${path[i].Location.x}_${path[i].Location.y}`).color = cc.color(0,255,0);
        }
    }
}
