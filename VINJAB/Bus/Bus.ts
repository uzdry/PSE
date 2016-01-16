//import {Map} from "./Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
/**
 * Created by valentin on 10/01/16.
 */


import Value from "./Utils";
import DBReqest from "./Utils";

export class Topic {
    private id:number;
    private name:string;

    constructor(pID:number, pName:string) {
        if (pID < 0) {
            return null;
        }
        this.id = pID;
        this.name = pName;
    }

    getID():number {
        return this.id;
    }

}

class Message {
    private topic:Topic;

    constructor(pTopic:Topic) {
        this.topic = pTopic;
    }

    getTopic():Topic {
        return this.topic;
    }
}

export default class BusDevice {
    broker:Broker;
    id:number;
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    public handleMessage(m:Message):void {
        this.abstractHandle();
    }

    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    public subscribe(t:Topic) {
        this.broker.subscribe(t, this);
    }

    public unsubscribe(t:Topic) {
        this.broker.unsubscribe(t, this);
    }

    public getID():number {
        return this.id;
    }


}

class Broker {

    private subs:{[tid: number]:Array<BusDevice>} = <any>[];
    private static instance:Broker;

    constructor() {

    }

    public static get():Broker {
        if (this.instance == null) {
            this.instance = new Broker();
        }
        return this.instance;
    }

    public handleMessage(m:Message):void {
        this.distribute(m);
    }

    public subscribe(topic:Topic, sub:BusDevice):void {

        if (!this.subs[topic.getID()]) {
            this.subs[topic.getID()] = new Array<BusDevice>();
        }

        this.subs[topic.getID()].push(sub);
    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {

        console.log(this.subs[topic.getID()].indexOf(sub) + " " + this.subs[topic.getID()].length);

        var index = this.subs[topic.getID()].indexOf(sub);
        this.subs[topic.getID()].splice(index, 1);

        for (var s in this.subs[topic.getID()]) {
            console.log(s.toString());
        }

    }

    private distribute(m:Message) {
        if (!this.subs[m.getTopic().getID()]) {
            return;
        }
        for (var bd in this.subs[m.getTopic().getID()]) {
            bd.handleMessage(m);
        }
    }
}

class DBRequestMessage extends Message {
    req: DBReqest;
    static TOPIC = new Topic(10, "Database request");

    constructor(pReq: DBReqest) {
        super(DBRequestMessage.TOPIC);
        this.req = pReq;
    }

}

class SettingsMessage extends Message {
    configs: {[tid: number]: Value};
}



