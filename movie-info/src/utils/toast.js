import { toast } from 'react-toastify';

export const TOAST_ID = {
  LOGIN_REQUIRED: 'login-required',
  COMMENT_OK: 'comment-ok',
  COMMENT_DEL_OK: 'comment-del-ok',
  BOOKMARK_ADD_OK: 'bm-add-ok',
  BOOKMARK_DEL_OK: 'bm-del-ok',
  AVATAR_OK: 'avatar-ok',
  NICK_OK: 'nick-ok',
  CLEAR_OK: 'clear-ok',
};

export const toastInfo = (msg, id) =>
  toast.info(msg, { toastId: id, autoClose: 1800 });

export const toastWarn = (msg, id) =>
  toast.warn(msg, { toastId: id, autoClose: 1800 });

export const toastSuccess = (msg, id) =>
  toast.success(msg, { toastId: id, autoClose: 1800 });

export const toastError = (msg, id) =>
  toast.error(msg, { toastId: id, autoClose: 2200 });

export async function withToastLoading(
  asyncFn,
  { pending, success, error, id }
) {
  const tid = toast.loading(pending);
  try {
    const result = await asyncFn();
    toast.update(tid, {
      render: success,
      type: 'success',
      isLoading: false,
      autoClose: 1500,
      toastId: id,
    });
    return result;
  } catch (e) {
    toast.update(tid, {
      render: error,
      type: 'error',
      isLoading: false,
      autoClose: 2000,
    });
    throw e;
  }
}
