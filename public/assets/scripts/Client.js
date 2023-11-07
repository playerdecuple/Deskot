const { ipcRenderer } = require("electron");


const $ = selector => document.querySelectorAll(selector);


Uint8Array.prototype.isSameData = function (target) {
    if (target == undefined) {
        return false;
    }
    return Array.from(this).every((v, i) => v === target[i]);
};


const Client = {

    // HTML5 Canvas Element
    canvas: null,

    // HTML5 Canvas Context
    context: null,

    get ctx() {
        return Client.context;
    },


    /**
     * Current image data
     * @type Uint8ClampedArray
     */
    image: null,



    init() {
        Client.canvas = $("canvas")[0];
        Client.context = Client.canvas.getContext('2d');

        Client.listen();
        window.requestAnimationFrame(Client.draw);
    },


    /**
     * Registers event listeners.
     */
    listen() {
        ipcRenderer.on("draw", ClientEventListener.onDrawRequest);
        ipcRenderer.on("play", ClientEventListener.onSoundPlayRequest);
        ipcRenderer.on("execute-behavior/failed", ClientEventListener.onFailExecuteBehavior);
    },


    /**
     * Draw image to canvas context.
     */
    async draw() {
        const { image, canvas, ctx } = Client;

        if (
            image == null
        ) {
            window.requestAnimationFrame(Client.draw);
            return;
        }
        
        const { src } = image;

        const blob = new Blob([ src ], { type: "image/png" });
        const bitmap = await createImageBitmap(blob);
        console.log(`Updating frame... ${image?.mirror ? "(Mirrored)" : ""}`);

        const { width, height } = bitmap;
        if (canvas.width != width || canvas.height != height) {
            // TODO: Send resize request
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (image?.mirror === true) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(bitmap, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        window.requestAnimationFrame(Client.draw);
    }

};



function setBehavior(name) {
    ipcRenderer.send('execute-behavior', name);
}

function setAction(name) {
    ipcRenderer.send('do-action', name);
}



window.onload = () => {
    Client.init();
}