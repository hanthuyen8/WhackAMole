// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component
{
    public static get You(): Player { return this._you; }
    public static get Opponent(): Player { return this._opponent; }

    private playerName: string = "";
    private playerId: number = -1;
    private score: number = 0;

    private static _you: Player = null;
    private static _opponent: Player = null;

    onLoad()
    {
        Player._you = this;
    }

    public addScore(moleId : string)
    {
        // cập nhật lên server
    }
}
