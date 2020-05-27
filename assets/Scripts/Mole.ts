// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;
enum MoleAnimations { Wait, MoleUp, MoleDown, MoleHit }

@ccclass
export default class Mole extends cc.Component
{
    private static readonly MOLE_HIT_EVENT = "MOLE_HIT_EVENT";
    
    public canHit = false;
    public moleId: number = -1;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    private _maxTimeAppear = 16;
    private _minTimeAppear = 4;
    private timeAppear = 0;

    private currentAnimation: MoleAnimations = MoleAnimations.Wait;

    onLoad()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.tryToHitMole, this);
        this.animation.on(cc.Animation.EventType.FINISHED, this.nextAnimation, this);

        this.waitForServerCommand();
        this.playAnimation(MoleAnimations.Wait);
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.tryToHitMole, this);
        this.animation.off(cc.Animation.EventType.FINISHED, this.nextAnimation, this);
    }

    update(dt)
    {
        this.timeAppear -= dt;
        if (this.timeAppear <= 0)
        {
            this.playAnimation(MoleAnimations.MoleUp);
            this.waitForServerCommand();
        }
    }

    public setId(id: number)
    {
        this.moleId = id;
    }

    public setTime(timeAppear: number)
    {
        this.timeAppear = timeAppear;
    }

    //#region Animation Event Call

    private moleIsReadyToGetHit()
    {
        this.canHit = true;
    }

    private moleIsEscaped()
    {
        this.canHit = false;
    }

    //#endregion
    
    private tryToHitMole()
    {
        if (this.canHit)
        {
            Player.You.addScore(this.name);
            this.playAnimation(MoleAnimations.MoleHit);
        }
    }

    //#region Play Animation

    private nextAnimation()
    {
        switch (this.currentAnimation)
        {
            case MoleAnimations.MoleUp:
                this.playAnimation(MoleAnimations.MoleDown);
                break;

            case MoleAnimations.MoleDown:
            case MoleAnimations.MoleHit:
                this.playAnimation(MoleAnimations.Wait);
                break;
        }
    }

    

    private playAnimation(animationName: MoleAnimations)
    {
        this.currentAnimation = animationName;
        if (animationName !== MoleAnimations.Wait)
        {
            this.animation.play(MoleAnimations[this.currentAnimation]);
        }
        else
        {
            this.sprite.spriteFrame = null;
        }
    }

    //#endregion

    private randomTimeAppear()
    {
        this.timeAppear = (Math.random() * (this._maxTimeAppear - this._minTimeAppear)) + this._minTimeAppear;
    }

    private waitForServerCommand()
    {
        this.timeAppear = 9999;
    }
}
