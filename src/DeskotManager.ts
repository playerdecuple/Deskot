import Main from "../main";
import Deskot from "./Deskot";
import LateInit from "./type/Lateinit";



class DeskotManager {

    private readonly deskotInstanceList: Array<Deskot> = [];

    private clock: LateInit<NodeJS.Timeout>;


    start() {
        let interval = Number(Main.config.tickInterval);

        this.clock = setInterval(() => {
            for (const deskot of this.deskotInstanceList) {
                deskot.tick();
            }
        }, interval);
    }


    register(instance: Deskot) {
        const duplicated = this.deskotInstanceList.find(deskot => deskot.id === instance.id);

        if (duplicated) {
            throw new Error("Already registered deskot instance.");
        }

        this.deskotInstanceList.push(instance);
    }


    dispose(id: number) {
        const idx = this.deskotInstanceList.findIndex(deskot => id === deskot.id);
        this.deskotInstanceList.splice(idx, 1);
    }

}


export default DeskotManager;