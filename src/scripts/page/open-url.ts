export function openUrl(url: string): void {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    const clickEvent = new MouseEvent('click');
    a.dispatchEvent(clickEvent);
}