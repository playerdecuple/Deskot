import Sprite from "./Sprite";
import DomUtil from "../utils/DomUtil";
import ImagePair from "../image/ImagePair";
import Deskot from "../Deskot";
import Sound from "../sound/Sound";
import Nullable from "../type/Nullable";
import Script from "../script/Script";
import Animation from "./Animation";
import Coordinate from "../position/Coordinate";


class AnimationBuilder {
    
    private readonly node: Element;

    private readonly sprites: Array<Sprite> = [];

    private readonly deskot: Deskot;

    private condition: Nullable<Script> = null;


    constructor(deskot: Deskot, animationNode: Element) {
        this.deskot = deskot;
        this.node = animationNode;

        if (animationNode.hasAttribute("condition")) {
            const conditionText = animationNode.getAttribute("condition")!!;
            const conditionScript = new Script(deskot, conditionText, true);

            this.condition = conditionScript;
        }
    }

    
    private async loadSprites() {
        // Clear array
        this.sprites.splice(0, this.sprites.length);

        const loadHelpers = [...this.node.children].map(async (spriteNode) => {
            if (spriteNode.tagName != "SPRITE") {
                throw new Error("Failed to validate animation node.");
            }
            const sprite = await this.loadSprite(spriteNode);
            return sprite;
        });
        const spriteList = await Promise.all(loadHelpers);

        this.sprites.push(...spriteList);
    }


    async build(condition: Nullable<Script> = this.condition): Promise<Animation> {
        await this.loadSprites();
        return new Animation(condition, this.sprites);
    }


    private async loadSprite(spriteNode: Element): Promise<Sprite> {
        const nodeAttr = DomUtil.getAttributes(spriteNode);

        const attrImage = nodeAttr.image!!;
        const attrRightImage = nodeAttr?.rightImage;
        const attrAnchor = nodeAttr?.anchor ?? "0,0";
        const attrVelocity = nodeAttr?.velocity ?? "0,0";
        const attrDuration = nodeAttr?.duration!!;
        
        const attrSound = nodeAttr?.sound;
        const attrVolume = nodeAttr?.volume ?? "0";

        let imagePair: ImagePair;
        let anchor: Coordinate;

        try {
            const anchorPos = attrAnchor.split(",");

            anchor = new Coordinate(Number(anchorPos[0]), Number(anchorPos[1]));
            imagePair = await ImagePair.loadPair(attrImage, attrRightImage, anchor, this.deskot);
        } catch (e) {
            throw new Error("Image not found.");
        }

        const velocityPos = attrVelocity.split(",");
        const velocity = new Coordinate(Number(velocityPos[0]), Number(velocityPos[1]));

        const duration = Number(attrDuration);

        let sound: Nullable<Sound> = null;
        try {
            if (attrSound != null) {
                sound = await Sound.load(attrSound, Number(attrVolume), this.deskot);
            }
        } catch (e) {
            throw new Error("Sound file not found.");
        }

        return new Sprite(imagePair, velocity.x, velocity.y, duration, sound);
    }

    
}


export default AnimationBuilder;