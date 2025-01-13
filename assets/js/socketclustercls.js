class SCClient {
    static CONNECTED = 1;
    static DISCONNECTED = 2;
    static CONNECTION_ABORT = 3;
    
    constructor() {
        if (!this.SOCKET) {
            let protocol = TSITE_SC_PROTOCOL;
            this.SOCKET = socketClusterClient.create({
                hostname: TSITE_SC_HOST,
                autoConnect: true,
                connectTimeout: 10000, //milliseconds
                ackTimeout: 10000, //milliseconds
                autoReconnect: true,
                autoReconnectOptions: {
                    initialDelay: 2000, //milliseconds
                    randomness: 2000, //milliseconds
                    multiplier: 0, //decimal
                    maxDelay: 15000 //milliseconds
                },
                path: TSITE_HOST_SC_PATH,
                port: TSITE_HOST_SC_PORT,
                secure: protocol.startsWith("https://") ? true : false
            });
        }
    }
    
    addEventListener(callback) {
        if (callback === undefined || callback === null) {
            return false;
        }
        (async () => {
            for await (let data of this.SOCKET.listener('connect')) {
                console.log('Connected to the server');
                callback(SCClient.CONNECTED, data);
            }
        })();
        (async () => {
            for await (let data of this.SOCKET.listener('connectAbort')) {
                console.log('connectAbort from the server');
                console.log(data);
                callback(SCClient.CONNECTION_ABORT, data);
            }
        })();
        (async () => {
            for await (let data of this.SOCKET.listener('disconnect')) {
                console.log('Disconnected from the server');
                console.log(data);
                callback(SCClient.DISCONNECTED, data);
            }
        })();
    }
    
    subscribe(channel_name, callback) {
        (async () => {
            let subscribed_channel = this.SOCKET.subscribe(channel_name);
            await subscribed_channel.listener('subscribe').once();
            for await (let data of subscribed_channel) {
                var jsonData = data;
                if (this.isValidJson(data)) {
                    jsonData = this.makeJson(data);
                }
                if (callback) {
                    callback(jsonData);
                }
            }
        })();
    }
    
    publish(channel_name, message) {
        this.SOCKET.transmitPublish(channel_name, message);
        return true;
    }
    
    isValidJson(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    makeJson(data) {
        if (this.isValidJson(data)) {
            var jsonData = JSON.parse(data);
            return this.makeJson(jsonData);
        } else {
            return data;
        }
    }
}

let SOCKET_OBJ = new SCClient();