const KEY = 'at-progress-v1';

export function getProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function setDone(id: string, done: boolean) {
  const p = getProgress();
  if (done) p[id] = true;
  else delete p[id];
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  window.dispatchEvent(new CustomEvent('progresschange'));
}

/** يضع علامة ✓ على كل عنصر يحمل data-progress-id مكتمل */
export function paintProgress(root: ParentNode = document) {
  const p = getProgress();
  root.querySelectorAll<HTMLElement>('[data-progress-id]').forEach((el) => {
    el.classList.toggle('is-done', !!p[el.dataset.progressId!]);
  });
  root.querySelectorAll<HTMLElement>('[data-progress-count]').forEach((el) => {
    const ids = el.dataset.progressCount!.split(',');
    const n = ids.filter((id) => p[id]).length;
    el.textContent = `${n} من ${ids.length}`;
    const bar = el.closest('[data-progress-wrap]')?.querySelector<HTMLElement>('[data-progress-bar]');
    if (bar) bar.style.setProperty('--p', String(n / ids.length));
  });
}
