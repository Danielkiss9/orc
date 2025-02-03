export const getSvcCost = (svc: OrphanedResource<ServiceSpec>): number => {
    if (svc.spec?.type == "LoadBalancer") {
        return 100;
    }
    
    return 0;
}