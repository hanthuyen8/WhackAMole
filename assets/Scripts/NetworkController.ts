import BaseRequest, { NetworkRequest } from "./Network/DataTypes";
import MessageBox from "./UI/MessageBox";
import Assert from "./Helper/Helper";

const { ccclass, property } = cc._decorator;
const client = new WebSocket("ws://localhost:55555");

@ccclass
export default class NetworkController extends cc.Component
{
    public static get Instance(): NetworkController { return this.instance; }
    private static instance: NetworkController = null;

    public get MessageBox(): MessageBox
    {
        if (this._messageBox == null || !cc.isValid(this._messageBox))
        {
            let no = cc.instantiate(this.messageBoxPrefab);
            no.parent = cc.Canvas.instance.node;
            no.setSiblingIndex(999);
            this._messageBox = no.getComponent(MessageBox);
        }
        return this._messageBox;
    }

    @property(cc.Prefab)
    private messageBoxPrefab: cc.Prefab = null;

    private awaitingRequest: Map<NetworkRequest, Function> = new Map;
    private _messageBox: MessageBox = null;

    onLoad()
    {
        // Singleton
        if (NetworkController.instance == null)
        {
            NetworkController.instance = this;
            cc.game.addPersistRootNode(this.node);
        }
        else
        {
            this.destroy();
            return;
        }

        this.assertions();
        this.listenToNetwork(null);
    }

    public listenToNetwork(handler: (message: MessageEvent) => void)
    {
        if (handler != null)
            client.onmessage = (message: MessageEvent) => handler(message);
        else
            client.onmessage = (message: MessageEvent) => this.messageReceived(message);
    }

    public sendRequest(type: NetworkRequest, data: string, callback: (message: string) => void)
    {
        if (client.readyState === WebSocket.OPEN)
        {
            if (!this.awaitingRequest.has(type))
            {
                let request = new BaseRequest(NetworkRequest[type], data);
                client.send(JSON.stringify(request));

                if (callback != null)
                    this.awaitingRequest.set(type, callback);

                cc.log(request);
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

    public waitForMessage(type: NetworkRequest, callback: (message: string) => void)
    {
        if (client.readyState === WebSocket.OPEN)
        {
            if (!this.awaitingRequest.has(type))
            {
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

    private messageReceived(message: MessageEvent)
    {
        if (!message)
            return;

        let responseData = JSON.parse(message.data) as BaseRequest;
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

            case NetworkRequest[NetworkRequest.Challenge]:
                requestId = NetworkRequest.Challenge;
                break;

            case NetworkController[NetworkRequest.StartGame]:
                this.awaitingRequest.clear();
                cc.director.loadScene("Game");
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

    private assertions()
    {
        if (!CC_DEBUG)
            return;

        Assert.isNotNull(this.node, this.messageBoxPrefab);
        Assert.isTrue(this.node, this.messageBoxPrefab.data.getComponent(MessageBox) != null);
    }
}