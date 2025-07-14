//External libraries
import { toast } from 'sonner';

export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};

export const showInfo = (message: string, description?: string) => {
  toast(message, {
    description,
  });
};

export const showCustom = (
  message: string,
  options?: {
    description?: string;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
  }
) => {
  toast(message, options);
};
