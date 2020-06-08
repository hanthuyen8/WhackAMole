// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Assert from "../Helper/Helper";
import NetworkController, { NetworkRequest } from "../NetworkController";
import { STC_GetIdlePlayers, STC_ChallengeFrom, CTS_ChallengeFrom, STC_ChallengeTo, CTS_ChallengeTo } from "../Network/DataTypes";
import LobbyPlayerUI from "./LobbyPlayerUI";
import MessageBox from "../UI/MessageBox";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component
{
    @property(cc.Node)
    private scrollContent: cc.Node = null;

    @property(cc.Prefab)
    private playerUI: cc.Prefab = null;

    private spawnPosition = cc.v2(0, -30);
    private networkController: NetworkController = null;

    onLoad()
    {
        Assert.isNotNull(this.node, this.scrollContent);
        Assert.isNotNull(this.node, this.playerUI);
    }

    start()
    {
        this.networkController = NetworkController.Instance;
        this.networkController.sendRequest(NetworkRequest.GetIdlePlayers, null, (response) => this.receiveIdlePlayers(response));
        this.networkController.waitForMessage(NetworkRequest.Challenge, (request) => this.filterChallengeMessage(request));
    }

    public challengeOtherPlayer(playerName: string)
    {
        let request = new CTS_ChallengeTo(playerName);
        let networkCtrl = NetworkController.Instance;
        networkCtrl.sendRequest(NetworkRequest.Challenge, JSON.stringify(request), (response) => this.filterChallengeMessage(response));
    }

    private receiveIdlePlayers(response: string)
    {
        let data = STC_GetIdlePlayers.tryParse(response);
        if (data)
        {
            for (let nickName of data.playerNames)
            {
                let node = cc.instantiate(this.playerUI);
                let player = node.getComponent(LobbyPlayerUI)

                node.parent = this.scrollContent;
                node.setPosition(this.spawnPosition);
                this.spawnPosition.y -= (node.height + 10);

                if (player)
                    player.init(this, nickName);
            }
        }
    }

    private filterChallengeMessage(requestData: string)
    {
        // Lọc message
        let to = STC_ChallengeTo.tryParse(requestData);
        if (to)
        {
            this.challengeResponse(to);
            return;
        }

        let from = STC_ChallengeFrom.tryParse(requestData);
        if (from)
        {
            this.someoneChallengeMe(from);
            return;
        }
    }

    private challengeResponse(data: STC_ChallengeTo)
    {
        if (data.success)
        {
            cc.director.loadScene("Game");
        }
        else
        {
            this.networkController.MessageBox.showInfo(data.message);
        }
    }

    private someoneChallengeMe(data: STC_ChallengeFrom)
    {
        let response = new CTS_ChallengeFrom();
        response.challengeId = data.challengeId;

        let yes = () =>
        {
            response.accept = true;
            this.networkController.sendRequest(NetworkRequest.Challenge, JSON.stringify(response), null);
        }

        let no = () =>
        {
            response.accept = false;
            this.networkController.sendRequest(NetworkRequest.Challenge, JSON.stringify(response), null);
        }

        this.networkController.MessageBox.ask(`Player: ${data.challenger} muốn thách đấu với bạn.`, yes, no);
    }
}
