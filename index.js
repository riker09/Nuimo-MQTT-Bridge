"use strict";

let Nuimo  = require("nuimojs"),
    mqtt   = require("mqtt"),
    _      = require("lodash"),
    matrix = require("./matrix.js");

let state = {
    broker: { connected: false },
    nuimo : { connected: false }
}

const client = mqtt.connect('mqtt://192.168.178.2', {
    username: "mqtt",
    password: "theL5iso"
});
client.on("connect", () => {
    console.log("MQTT connected")
    state.broker.connected = true;
    client.subscribe('home/nuimo/set');
    client.publish('home/nuimo', 'Connected to Nuimo controller');
});
client.on("message", (topic, message) => {
    console.log("Received message", message.toString())
    if (state.nuimo.connected) {
        var data = JSON.parse(message);
        switch (data.action) {
            case "render":
                actions.writeToMatrix(data.text);
                break;
        }
    }
});

const nuimo = new Nuimo();
nuimo.on("discover", (device) => {

    console.log(`Discovered Nuimo (${device.uuid})`);

    device.on("connect", () => {
        console.log("Nuimo connected");
        state.nuimo.connected = true;
    });

    device.on("disconnect", () => {
        console.log("Nuimo disconnected");
        state.nuimo.connected = false;
    });

    // @TODO: Send battery state via MQTT

    device.on("press", () => {
        device.setLEDMatrix(matrix.icons.bulb, 255, 2000);
        client.publish("home/nuimo/press");
    });

    device.on("swipe", (direction) => {
        let value = "";
        switch (direction) {
            case Nuimo.Swipe.LEFT:
                value = 'LEFT';
                break;
            case Nuimo.Swipe.RIGHT:
                value = 'RIGHT';
                break;
            case Nuimo.Swipe.UP:
                value = 'UP';
                break;
            case Nuimo.Swipe.DOWN:
                value = 'DOWN';
                actions.ticker('ABC');
                break;
        }
        client.publish("home/nuimo/swipe", JSON.stringify({ value: value, raw_value: direction }));
    });

    device.on("touch", (area) => {
        let value = "";
        switch (area) {
            case Nuimo.Area.LEFT:
                value = "LEFT";
                break;
            case Nuimo.Area.RIGHT:
                value = "RIGHT";
                break;
            case Nuimo.Area.TOP:
                value = "TOP";
                break;
            case Nuimo.Area.BOTTOM:
                value = "BOTTOM";
                break;
            case Nuimo.Area.LONGLEFT:
                value = "LONGLEFT";
                break;
            case Nuimo.Area.LONGBOTTOM:
                value = "LONGBOTTOM";
                break;
            case Nuimo.Area.LONGRIGHT:
                value = "LONGRIGHT";
                break;
        }
        client.publish("home/nuimo/touch", JSON.stringify({ value: value, raw_value: area }));
    });

    device.on("rotate", (amount) => {
        console.log('amount', amount)
        rotation += amount;
        rotate(client, rotation)
    });

    device.connect();
});

// Debounce ("throttle") the calls to rotate event. This event can be triggered multiple times during a physical rotation
let rotation = 0;
const rotate = _.debounce((client, amount) => {
    let direction = amount > 0 ? "RIGHT" : "LEFT";
    if (state.broker.connected) {
        client.publish("home/nuimo/rotate", JSON.stringify({ value: direction, raw_value: amount }));
    }
     // Reset rotation value
    rotation = 0;
}, 200);

const actions = {
    writeToMatrix (message) {
        if (state.nuimo.connected) {
            var devices = nuimo.getConnectedDevices();
            let iv;
            devices.forEach((d) => {
                let matrizes = [];
                message.split("").forEach((c) => {
                    matrizes.push(helpers.convertCharToMatrix(c));
                });
                iv = setInterval(() => {
                    d.setLEDMatrix(matrizes.shift(), 255, 1000, 16);
                    if (matrizes.length < 1) {
                        clearInterval(iv);
                    }
                }, 1000);
            });
        }
    },
    ticker (text) {
        // @TODO: Implement this
        let matrizes = [];
        text.split("").forEach((c) => {
            matrizes.push(helpers.convertCharToMatrix(c));
        });
        let dim = Math.sqrt(matrizes[0].length);
        let lng = [];
        let disp = [];
        matrizes.forEach((m, j) => {
            m.forEach((c) => {
                lng.push(c);
            });
        });
        lng.foreach


        // var devices = nuimo.getConnectedDevices();
        // devices.forEach((device) => {

        // });
    }
}

const helpers = {
    convertCharToMatrix(str) {
        return matrix.chars[str.toUpperCase()];
    },
    buildMatrix (text) {
        const size = 9;
        let result = [];
        let chars = text.split("");

        let matrizes = [];
        chars.forEach((chr) => {
            let currentMatrix = helpers.convertCharToMatrix(chr);
            matrizes.push(currentMatrix);
        });
    },
    getMatrixRow (matrix, row, dim) {
        return matrix.filter((v,k) => k % dim === row);
    }
}

nuimo.scan();

actions.ticker('AB');