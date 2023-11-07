const ClientEventListener = {

    // On draw request
    onDrawRequest(_, clientImage) {
        const pair = clientImage.image;

        const image = clientImage.isLookRight && pair.rightImage != null
            ? pair.rightImage
            : pair.leftImage;

        if (clientImage.isLookRight && pair.rightImage == null) {
            image.mirror = true;
        }
        
        Client.image = {...image};
    },


    // On sound play request
    onSoundPlayRequest(_, sound) {
        // TODO: Sound play
    },

    
    onFailExecuteBehavior(_, message) {
        console.error(message);
    }

};

