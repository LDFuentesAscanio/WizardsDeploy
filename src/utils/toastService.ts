import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ConfirmOptions = {
  description?: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
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

export const showConfirm = (message: string, options: ConfirmOptions) => {
  toast(message, {
    description: options.description,
    duration: Infinity,
    action: {
      label: options.confirmText || 'Confirm',
      onClick: async () => {
        await options.onConfirm();
      },
    },
  });
};

// Versión mejorada para confirmación con cancelación
export const showConfirmWithCancel = (
  message: string,
  options: ConfirmOptions & { cancelText?: string; onCancel?: () => void }
) => {
  const toastId = toast(message, {
    description: options.description,
    duration: Infinity,
    action: {
      label: options.confirmText || 'Confirm',
      onClick: async () => {
        await options.onConfirm();
        toast.dismiss(toastId);
      },
    },
  });

  // Botón de cancelación como toast separado
  if (options.onCancel) {
    toast.info(options.cancelText || 'Cancel', {
      duration: Infinity,
      id: `${toastId}-cancel`,
      action: {
        label: 'Cancel',
        onClick: () => {
          options.onCancel?.();
          toast.dismiss(toastId);
          toast.dismiss(`${toastId}-cancel`);
        },
      },
    });
  }
};

// Para operaciones async con feedback
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
