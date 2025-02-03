import { getNodeCost } from "./resources-costs/node-cost";
import { getPvcCost } from "./resources-costs/pvc-cost";
import { getSvcCost } from "./resources-costs/svc-cost";

export const getResourceCost = async (resource: OrphanedResource<any>): Promise<number | undefined> => {
    console.log("kind", resource.kind);
    switch (resource.kind) {
        case 'PersistentVolumeClaim':
            return getPvcCost(resource);
        case 'Node':
            return getNodeCost(resource);
        case 'Service':
            return getSvcCost(resource);
        default:
            return undefined;
    }
}