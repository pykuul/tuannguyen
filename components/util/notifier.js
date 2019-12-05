import { openSnackbar } from "../layouts/Notifier";

export default function notify(obj) {
  openSnackbar({ message: obj.message || obj.toString() });
}
