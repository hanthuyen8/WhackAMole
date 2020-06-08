// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Assert from "../Helper/Helper";
import NetworkController, { NetworkRequest } from "../NetworkController";
import { CTS_Register, STC_Register } from "../Network/DataTypes";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component
{
    @property(cc.EditBox)
    private inputBox: cc.EditBox = null;

    @property(cc.Label)
    private infoLabel: cc.Label = null;

    @property(cc.Button)
    private loginButton: cc.Button = null;

    onLoad()
    {
        Assert.isNotNull(this.node, this.inputBox);
        Assert.isNotNull(this.node, this.infoLabel);
        Assert.isNotNull(this.node, this.loginButton);
    }

    public register()
    {
        this.loginButton.interactable = false;

        let nickName = this.inputBox.string;
        if (nickName.length > 0)
        {
            let data = new CTS_Register(nickName);
            NetworkController.Instance.sendRequest(NetworkRequest.Register, JSON.stringify(data), (response) => this.receiveRegisterResponse(response));
        }
    }

    private receiveRegisterResponse(response: string)
    {
        let responseData = STC_Register.tryParse(response);
        if (response)
        {
            this.infoLabel.string = responseData.message;
            if (responseData.success)
            {
                cc.director.loadScene("Lobby");
            }

            this.loginButton.interactable = true;
        }
    }
}
