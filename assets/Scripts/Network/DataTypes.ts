export default class ClientRequestData
{
    action: string;
    data: string;

    constructor(action: string, data: string)
    {
        this.action = action;
        this.data = data;
    }
}
//#region Register Data
export class RegisterRequest
{
    nickName: string;

    constructor(nickName: string)
    {
        this.nickName = nickName;
    }
}

export interface RegisterResponse
{
    success: boolean
    message: string
}
//#endregion

//#region Get Idle Players Data
export interface GetIdlePlayersResponse
{
    playerNames: string[];
}
//#endregion