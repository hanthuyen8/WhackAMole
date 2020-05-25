// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Mole from "./Mole";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component
{
    @property([Mole])
    moles: Mole[] = [];

    // Cập nhật mạng:
    // sửa canHit của Mole nào đó thành false nếu Opponent đã click trước.

    public addScoreToOpponent(score: number, moleId: string)
    {

    }

    public addScoreToPlayer(score: number, moleId: string)
    {

    }

    public initMoles(moleData: MoleData[])
    {
        for (let i = 0; i < moleData.length; i++)
        {
            this.moles[i].init(moleData[i].timeAppears);
        }
    }
}

export class MoleData
{
    public timeAppears: number[] = [];
}
