import Deskot from "../Deskot";
import Script from "../script/Script";


class DomUtil {

    static getAttributes(node: Element) {
        const attr: any = {};

        for (const key of node.getAttributeNames()) {
            const value = node.getAttribute(key);
            attr[key] = value;
        }

        return attr;
    }


    static parseAttributes(deskot: Deskot, attr: any): Script | any {
        const newAttr: any = {};
        for (let [ k, v ] of Object.entries(attr)) {
            if (v instanceof Script) {
                newAttr[k] = v;
                continue;
            }
            newAttr[k] = DomUtil.parse(deskot, String(v));
        }
        return newAttr;
    }


    static parse(deskot: Deskot, v: string): any {
        if (v == undefined) {
            return undefined;
        }

        let result;
        v = v.trim();

        if (v.startsWith("${") && v.endsWith("}")) {
            result = new Script(deskot, v.substring(2, v.length - 1), false);
        } else if (v.startsWith("#{") && v.endsWith("}")) {
            result = new Script(deskot, v.substring(2, v.length - 1), true);
        } else {
            switch (v) {
                case "null":
                    result = null;
                    break;
                case "true":
                case "false":
                    result = v === "true";
                    break;
                default:
                    result = Number(v);
                    if (isNaN(result)) {
                        result = v;
                    }
            }
        }

        return result;
    }

}


export default DomUtil;