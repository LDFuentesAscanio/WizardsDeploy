// utils/toastService.ts
import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

export const showInfo = (message: string, options?: ToastOptions) => {
  toast(message, options);
};

export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, options);
};

export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};

export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) => {
  const toastId = toast.loading(messages.loading);

  promise
    .then((data) => {
      const successMessage =
        typeof messages.success === 'function'
          ? messages.success(data)
          : messages.success;
      toast.success(successMessage, { id: toastId });
    })
    .catch((error) => {
      const errorMessage =
        typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error;
      toast.error(errorMessage, { id: toastId });
    });

  return toastId;
};
