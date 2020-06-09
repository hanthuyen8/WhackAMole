/**
     * Cách thức mà Game sẽ hoạt động:
     * Vì mục đích để server không bị quá tải, cho nên server sẽ chỉ chịu trách nhiệm nhận-truyền dữ liệu giữa các client,
     * mà không chịu bất kỳ tác vụ tính toán nào bên trong game.
     * Tuy nhiên, data do client khởi tạo sẽ không được áp dụng ngay trên chính client đó (để đảm bảo sự đồng bộ giữa các client),
     * mà phải gửi cho server, để server truyền đến tất cả các client (bao gồm cả client đã tạo ra data đó).
     * Sau khi client đã nhận được data do server truyền đến thì data đó mới được áp dụng.
     */

import Mole from "./Mole";
import NetworkController from "../NetworkController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component
{
    /**
     * PlayerA sẽ chịu trách nhiệm tính toán thời gian xuất hiện của tất cả các Mole.
     */

    @property([Mole])
    moles: Mole[] = [];

    private playerId: string = null;

    onLoad()
    {
        NetworkController.Instance.listenToNetwork(this.dataReceived);
        for (let i = 0; i < this.moles.length; i++)
        {
            this.moles[i].setId(i);
        }
    }

    private dataReceived(message: MessageEvent)
    {

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
