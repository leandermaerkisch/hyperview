import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  SingleValueValidator,
  Validation,
} from 'hyperview/src/types';
import * as Logging from 'hyperview/src/services/logging';

export default {
  check: (value: string | null | undefined, element: Element): Validation => {
    const maxLengthStr: string | null = element.getAttribute('max');
    const maxLength = parseInt(maxLengthStr || '', 10);
    if (isNaN(maxLength)) {
      Logging.warn(`[validators/max-length]: invalid length attribute of ${maxLengthStr}`);
    }

    if (value !== null) {
      const valueLength: number = value ? value.length : 0;
      if (valueLength > maxLength) {
        return {
          message:
            element.getAttribute('message') || 'This field has bad length',
          valid: false,
        };
      }
    }

    return { valid: true };
  },
  name: 'max-length',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
} as SingleValueValidator;
