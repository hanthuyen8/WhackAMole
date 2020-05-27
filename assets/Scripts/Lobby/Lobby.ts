// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Assert from "../Helper/Helper";
import NetworkController, { NetworkRequest } from "../NetworkController";
import { GetIdlePlayersResponse } from "../Network/DataTypes";
import LobbyPlayerUI from "./LobbyPlayerUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component
{
    @property(cc.Node)
    private scrollContent: cc.Node = null;

    @property(cc.Prefab)
    private playerUI: cc.Prefab = null;

    private spawnPosition = cc.v2(0, -30);

    onLoad()
    {
        Assert.isNotNull(this.node, this.scrollContent);
        Assert.isNotNull(this.node, this.playerUI);
    }

    start()
    {
        NetworkController.Instance.sendRequest(NetworkRequest.GetIdlePlayers, null, (response) => this.receiveIdlePlayers(response));
    }

    private receiveIdlePlayers(response: string)
    {
        if (response && response.length > 0)
        {
            let responseData = JSON.parse(response) as GetIdlePlayersResponse;
            if (responseData && responseData.playerNames)
            {
                for (let nickName of responseData.playerNames)
                {
                    let node = cc.instantiate(this.playerUI);
                    let player = node.getComponent(LobbyPlayerUI)

                    node.parent = this.scrollContent;
                    node.setPosition(this.spawnPosition);
                    this.spawnPosition.y -= (node.height + 10);

                    if (player)
                        player.setName(nickName);
                }
            }
        }
    }
}
