import { check } from '@tauri-apps/plugin-updater';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

export async function checkForAppUpdates() {
  const update = await check();

  if (update?.available) {
    const wantsUpdate = await ask(`Update to ${update.version}`);

    if (wantsUpdate) {
      await update.downloadAndInstall();
      await relaunch();
    }
  }
}
