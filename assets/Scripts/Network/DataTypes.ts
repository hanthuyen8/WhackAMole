import { Helper } from "../Helper/Helper"

export default class BaseRequest
{
    public action: string;
    public data: string;

    constructor(action: string, data: string)
    {
        this.action = action;
        this.data = data;
    }

    public static tryParse(json: string): BaseRequest | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as BaseRequest;
        if (Helper.stringIsEmpty(data.action))
            return null;

        return data;
    }
}

//#region Register Data
export class CTS_Register
{
    public nickName: string;

    constructor(nickName: string)
    {
        this.nickName = nickName;
    }

    public static tryParse(json: string): CTS_Register | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_Register;
        if (Helper.stringIsEmpty(data.nickName))
            return null;

        return data;
    }
}

export class STC_Register
{
    success: boolean;
    message: string;

    constructor(success: boolean, message: string)
    {
        this.message = message;
        this.success = success;
    }

    public static tryParse(json: string): STC_Register | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as STC_Register;
        if (Helper.stringIsEmpty(data.message) || data.success == null)
            return null;

        return data;
    }
}
//#endregion

//#region  Get Idle Player Data
export class STC_GetIdlePlayers
{
    public playerNames: string[] = [];

    public static tryParse(json: string): STC_GetIdlePlayers | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as STC_GetIdlePlayers;
        if (!data.playerNames || data.playerNames.length === 0)
            return null;

        return data;
    }
}
//#endregion

//#region Game Data
export class CTS_ChallengeTo
{
    public otherPlayerName: string = "";

    constructor(otherPlayerName: string)
    {
        this.otherPlayerName = otherPlayerName;
    }

    public static tryParse(json: string): CTS_ChallengeTo | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_ChallengeTo;
        if (Helper.stringIsEmpty(data.otherPlayerName))
            return null;

        return data;
    }
}

export class STC_ChallengeTo
{
    public success: boolean;
    public message: string;

    constructor(success: boolean, message: string)
    {
        this.success = success;
        this.message = message;
    }

    public static tryParse(json: string): STC_ChallengeTo | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as STC_ChallengeTo;
        if (Helper.stringIsEmpty(data.message) || data.success == null)
            return null;

        return data;
    }
}

export class STC_ChallengeFrom
{
    public challenger: string = "";
    public challengeId: string = "";

    public static tryParse(json: string): STC_ChallengeFrom | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as STC_ChallengeFrom;
        if (Helper.stringIsEmpty(data.challenger) || Helper.stringIsEmpty(data.challengeId))
            return null;

        return data;
    }
}

export class CTS_ChallengeFrom
{
    public accept: boolean = false;
    public challengeId: string = "";

    public static tryParse(json: string): CTS_ChallengeFrom | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_ChallengeFrom;
        if (Helper.stringIsEmpty(data.challengeId) || data.accept == null)
            return null;

        return data;
    }
}
//#endregion