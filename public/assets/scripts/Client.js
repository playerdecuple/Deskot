"use strict";

const { ipcRenderer } = require("electron");

const $ = selector => document.querySelectorAll(selector);


function listen() {
    console.log("Event listening start...");

    let canDraw = true;

    ipcRenderer.on("draw", async (e, clientImage) => {
        if (!canDraw) return;
        canDraw = false;

        const canvas = $("canvas")[0];
        const ctx = canvas.getContext('2d');
        const pair = clientImage.image;
        
        let image = pair.leftImage;
        if (clientImage.isLookRight && pair.rightImage != null) {
            image = pair.rightImage;
        }

        const blob = new Blob([image.src], { type: "image/png" });
        const bitmap = await createImageBitmap(blob);

        console.log(`Updating bitmap: ${bitmap}`);

        const { width, height } = bitmap;
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (clientImage.isLookRight && pair.rightImage == null) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(bitmap, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ipcRenderer.send("draw-response", new Date().getTime());
        canDraw = true;
    });


    ipcRenderer.on("play", e => {

    });
}


window.onload = () => {
    listen();
}