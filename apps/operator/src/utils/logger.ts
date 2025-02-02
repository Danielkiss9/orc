import { K8sResource } from '../types';

export const generateResourceName = (resource: K8sResource): string => {
  const namespace = resource.metadata.namespace;
  const name = resource.metadata.name;
  const kind = resource.kind.toLowerCase();

  return namespace ? `${kind}/${namespace}/${name}` : `${kind}/${name}`;
};

export const getResourceLabels = (resource: K8sResource): string => {
  if (!resource.metadata.labels) {
    return '';
  }

  return Object.entries(resource.metadata.labels)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
};