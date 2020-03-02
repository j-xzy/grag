import * as util from '@/lib/util';

export function mergeDefaultConfig(config: IGrag.IProviderConfig) {
  return {
    color: config.color ?? '#1890ff',
    id: config.id ?? util.uuid()
  };
}

export const resizeCursorDics = {

};
