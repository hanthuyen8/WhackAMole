// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Assert from "../Helper/Helper";
import NetworkController, { NetworkRequest } from "../NetworkController";
import { CTS_ChallengeTo, STC_ChallengeTo } from "../Network/DataTypes";
import MessageBox from "../UI/MessageBox";
import Lobby from "./Lobby";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyPlayerUI extends cc.Component
{
    @property(cc.Label)
    private playerName: cc.Label = null;

    @property(cc.Button)
    private challengeBtn: cc.Button = null;

    private nickName: string = "";
    private lobby: Lobby = null;

    onLoad()
    {
        Assert.isNotNull(this.node, this.playerName);
        Assert.isNotNull(this.node, this.challengeBtn);
    }

    public init(lobby: Lobby, nickName: string)
    {
        this.lobby = lobby;
        this.playerName.string = nickName;
        this.nickName = nickName;
    }

    public challenge()
    {
        this.lobby.challengeOtherPlayer(this.nickName);
    }
}
