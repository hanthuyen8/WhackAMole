// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Assert from "../Helper/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MessageBox extends cc.Component
{
    @property(cc.Node)
    private background: cc.Node = null;

    @property(cc.Label)
    private messageLabel: cc.Label = null;

    @property(cc.BlockInputEvents)
    private blockInput: cc.BlockInputEvents = null;

    @property(cc.Button)
    private okButton: cc.Button = null;

    @property(cc.Button)
    private yesButton: cc.Button = null;

    @property(cc.Button)
    private noButton: cc.Button = null;

    private yesCallback: Function = null;
    private noCallback: Function = null;

    onLoad()
    {
        Assert.isNotNull(this.node, this.background);
        Assert.isNotNull(this.node, this.messageLabel);
        Assert.isNotNull(this.node, this.blockInput);
        Assert.isNotNull(this.node, this.okButton);
        Assert.isNotNull(this.node, this.yesButton);
        Assert.isNotNull(this.node, this.noButton);

        let canvas = cc.Canvas.instance.node;
        this.background.width = canvas.width;
        this.background.height = canvas.height;
        this.background.setPosition(cc.v2(0, 0));
        this.node.setPosition(cc.Vec2.ZERO);

        this.hide();
    }

    public showInfo(message: string)
    {
        this.showMessage(message);

        this.yesButton.node.active = false;
        this.noButton.node.active = false;
        this.okButton.node.active = true;
    }

    public ask(message: string, yes: Function, no: Function)
    {
        this.showMessage(message);

        this.yesCallback = yes;
        this.noCallback = no;

        this.yesButton.node.active = true;
        this.noButton.node.active = true;
        this.okButton.node.active = false;
    }

    public hide()
    {
        this.yesCallback = null;
        this.noCallback = null;

        this.node.active = false;
        this.blockInput.enabled = false;
    }

    private answerYes()
    {
        if (this.yesCallback)
            this.yesCallback();

        this.hide();
    }

    private answerNo()
    {
        if (this.noCallback)
            this.noCallback();

        this.hide();
    }

    private showMessage(message: string)
    {
        if (!message || message.length == 0)
            throw new Error("message không được trống");

        this.messageLabel.string = message;
        this.node.active = true;
        this.blockInput.enabled = true;
    }
}
