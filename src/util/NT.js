import { NetworkTables, NetworkTablesTypeInfos } from 'ntcore-ts-client';
import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';

let pubuid = 1000;
class NT {
    constructor(ip) {
        this.ip = ip;
        
        this.nt  = NetworkTables.getInstanceByURI(ip);
        this.nt.changeURI("10.69.95.2");

        this.ntSubscribers = {}
    }

    setIP(ip) {
        if(this.ip !== ip) {
            this.nt.changeURI(ip);
        }
        this.ip = ip;        
    }
    NTSubscriber(init, key, topicType) {

        const internal = writable(init);
        console.log("create")
        let _val = init;
        let topic = this.nt.createTopic(key, topicType);
        let subuuid = topic.subscribe((value)=>{
                internal.set(value);
            }
        );

        const subscribe = internal.subscribe;
        
        const get = ()=>topic.getValue();
        
        const type = () => topicType;

        let store = {}
        store.subscribe = subscribe;
        store.get = get;
        store.type = type;
        return store;
    }

    NTIntSubscriber         (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kInteger) }
    NTDoubleSubscriber      (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kDouble) }
    NTBooleanSubscriber     (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kBoolean) }
    NTStringSubscriber      (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kString) }
    NTIntArraySubscriber    (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kIntegerArray) }
    NTDoubleArraySubscriber (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kDoubleArray) }
    NTBooleanArraySubscriber(init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kBooleanArray) }
    NTStringArraySubscriber (init, key){return this.NTSubscriber(init, key, NetworkTablesTypeInfos.kStringArray) }

    NTPublisher(init, key, topicType) {

        const internal = writable(init);
        console.log("create")
        let _val = init;
        let topic = this.nt.createTopic(key, topicType);

        const subscribe = internal.subscribe;
        
        const set = async (v) => {
            if (!topic.publisher || topic.pubuid === undefined) {
                console.log("Publishing")
                console.log(await topic.publish({}, pubuid));
                pubuid = pubuid+1;
                console.log(topic)
                console.log(this.nt.client)
            }
            topic.setValue(v);
            internal.set(v);
        };

        const get = ()=>topic.getValue();
        
        const update = async (fn) => await set(fn(_val));
        const type = () => topicType;

        // We create our store as a function so that it can be passed as a callback where the value to set is the first parameter
        async function store(val) {await set(val)}
        store.subscribe = subscribe;
        store.set = set;
        store.get = get;
        store.update = update;
        store.type = type;
        return store;
    }

    NTIntPublisher         (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kInteger) }
    NTDoublePublisher      (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kDouble) }
    NTBooleanPublisher     (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kBoolean) }
    NTStringPublisher      (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kString) }
    NTIntArrayPublisher    (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kIntegerArray) }
    NTDoubleArrayPublisher (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kDoubleArray) }
    NTBooleanArrayPublisher(init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kBooleanArray) }
    NTStringArrayPublisher (init, key){return this.NTPublisher(init, key, NetworkTablesTypeInfos.kStringArray) }
    
}




export default new NT("127.0.0.1");