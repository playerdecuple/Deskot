import Deskot from "./Deskot";



class DeskotManager {

    private readonly deskotInstanceList: Array<Deskot> = [];


    register(instance: Deskot) {
        const duplicated = this.deskotInstanceList.find(deskot => deskot.id === instance.id);
        this.deskotInstanceList.push(instance);
    }


    dispose(id: number) {
        const idx = this.deskotInstanceList.findIndex(deskot => id === deskot.id);
        this.deskotInstanceList.splice(idx, 1);
    }

}


export default DeskotManager;