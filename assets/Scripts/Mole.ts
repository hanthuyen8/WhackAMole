// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Mole extends cc.Component
{
    public canHit = false;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    private _maxTimeAppear = 16;
    private _minTimeAppear = 4;
    private timeAppear = 0;

    private static readonly MOLE_ANIM_UP = "MoleUp";
    private static readonly MOLE_ANIM_DOWN = "MoleDown";
    private static readonly MOLE_ANIM_HIT = "MoleHit";
    private static readonly MOLE_ANIM_NONE = "";
    private currentAnimation: string = "";

    onLoad()
    {
        this.randomTimeAppear();
        this.node.on(cc.Node.EventType.TOUCH_START, this.tryToHitMole, this);
        this.animation.on(cc.Animation.EventType.FINISHED, this.nextAnimation, this);
        this.playAnimation(Mole.MOLE_ANIM_NONE);
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
            this.moleUp();
        }
    }

    public init(timeAppears: number[])
    {
        
    }

    public moleIsReadyToGetHit()
    {
        this.canHit = true;
    }

    public moleIsEscaped()
    {
        this.canHit = false;
    }

    private nextAnimation()
    {
        switch (this.currentAnimation)
        {
            case Mole.MOLE_ANIM_UP:
                this.playAnimation(Mole.MOLE_ANIM_DOWN);
                break;

            case Mole.MOLE_ANIM_DOWN:
            case Mole.MOLE_ANIM_HIT:
                this.playAnimation(Mole.MOLE_ANIM_NONE);
                break;
        }
    }

    private moleUp()
    {
        this.timeAppear = 999;
        this.playAnimation(Mole.MOLE_ANIM_UP);
    }

    private tryToHitMole()
    {
        if (this.canHit)
        {
            Player.You.addScore(this.name);
            this.timeAppear = 999;
            this.playAnimation(Mole.MOLE_ANIM_HIT);
        }
    }

    private playAnimation(animationName: string)
    {
        this.currentAnimation = animationName;
        if (animationName !== Mole.MOLE_ANIM_NONE)
        {
            this.animation.play(this.currentAnimation);
        }
        else
        {
            this.sprite.spriteFrame = null;
            this.randomTimeAppear();
        }
    }

    private randomTimeAppear()
    {
        this.timeAppear = (Math.random() * (this._maxTimeAppear - this._minTimeAppear)) + this._minTimeAppear;
    }
}
