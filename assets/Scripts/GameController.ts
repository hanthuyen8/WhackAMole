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

    private playerId: string = null;

    onLoad()
    {
        for (let i = 0; i < this.moles.length; i++)
        {
            this.moles[i].setId(i);
        }
    }

    start()
    {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.open("GET", "http://localhost:3000/", true);
        xhr.send();
    }

    // Cập nhật mạng:
    // sửa canHit của Mole nào đó thành false nếu Opponent đã click trước.

    public addScoreToOpponent(score: number, moleId: string)
    {

    }

    public addScoreToPlayer(score: number, moleId: string)
    {

    }

    public initMoles(moleData: MoleData)
    {
        let id = moleData.modeId;
        if (id < 0 || id > this.moles.length)
            return;

        let mole = this.moles[id];

        if (mole)
            mole.setTime(moleData.timeAppears);
    }
}

export class MoleData
{
    public modeId: number = -1;
    public timeAppears: number = -1;
}
