import ClientRequestData from "./Network/DataTypes";

export enum NetworkRequest { Register, GetIdlePlayers }

const { ccclass, property } = cc._decorator;
const client = new WebSocket("ws://localhost:55555");

@ccclass
export default class NetworkController extends cc.Component
{
    public static get Instance(): NetworkController { return this._instance; }

    private awaitingRequest: Map<NetworkRequest, Function> = new Map;

    private static _instance: NetworkController = null;

    onLoad()
    {
        // Singleton
        if (NetworkController._instance == null)
        {
            NetworkController._instance = this;
            cc.game.addPersistRootNode(this.node);
        }
        else
        {
            this.destroy();
            return;
        }

        // Open Socket
        client.onmessage = (message: MessageEvent) => this.receiveMessage(message);
    }

    public sendRequest(type: NetworkRequest, data: string, callback: (message: string) => void)
    {
        if (client.readyState === WebSocket.OPEN)
        {
            if (!this.awaitingRequest.has(type))
            {
                let request = new ClientRequestData(NetworkRequest[type], data);
                client.send(JSON.stringify(request));
                this.awaitingRequest.set(type, callback);
            }
            else
            {
                callback("Đang chờ tín hiệu.")
            }
        }
        else
        {
            callback("Network có vấn đề.")
        }
    }

    private receiveMessage(message: MessageEvent)
    {
        if (!message)
            return;

        let responseData = JSON.parse(message.data) as ClientRequestData;
        if (!responseData.action)
            return;

        let requestId = -1;
        switch (responseData.action)
        {
            case NetworkRequest[NetworkRequest.Register]:
                requestId = NetworkRequest.Register;
                break;

            case NetworkRequest[NetworkRequest.GetIdlePlayers]:
                requestId = NetworkRequest.GetIdlePlayers;
                break;
        }

        if (requestId >= 0)
        {
            if (this.awaitingRequest.has(requestId))
            {
                let callback = this.awaitingRequest.get(requestId);
                callback(responseData.data);
                this.awaitingRequest.delete(requestId);
            }
        }
    }
}