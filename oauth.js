'use strict';
(() => {
  const clientId = 'sq0idp-MfFqna-GBdN9O9Cbqxa41A';
  const redirect = 'https://tomlevett.github.io/1381-square-oauth/';
  const scopes = ['MERCHANT_PROFILE_READ', 'ORDERS_READ', 'PAYMENTS_READ'];
  const key = 'square_reports_oauth_state';
  const button = document.getElementById('connect');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const codeField = document.getElementById('authorization-code');
  const copyButton = document.getElementById('copy-code');
  const query = new URLSearchParams(location.search);
  const code = query.get('code');
  const returnedState = query.get('state');
  // Remove the temporary response from the address bar before any user action.
  if (location.search) history.replaceState(null, '', location.pathname);
  const hosted = location.origin + location.pathname === redirect;
  if (!hosted) {
    button.disabled = true;
    status.textContent = 'Open the registered HTTPS connection page to continue.';
    return;
  }
  if (query.has('error')) {
    sessionStorage.removeItem(key);
    status.textContent = 'Square authorisation did not complete. You can start again.';
  } else if (code) {
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) {}
    sessionStorage.removeItem(key);
    const age = pending ? Date.now() - pending.created : Infinity;
    if (!pending || pending.value !== returnedState || age < 0 || age > 600000) {
      status.textContent = 'This response does not match the connection request. Please start again.';
    } else {
      codeField.value = code;
      result.hidden = false;
      button.disabled = true;
      status.textContent = 'Authorisation received. Keep this page open while the secure connection is completed.';
    }
  }
  copyButton.addEventListener('click', async () => {
    if (!codeField.value) return;
    try {
      await navigator.clipboard.writeText(codeField.value);
      copyButton.textContent = 'Copied';
    } catch (_) {
      status.textContent = 'Copy did not complete. Use the browser clipboard permission prompt and try again.';
    }
  });
  button.addEventListener('click', () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const nonce = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem(key, JSON.stringify({value: nonce, created: Date.now()}));
    const url = new URL('https://connect.squareup.com/oauth2/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('redirect_uri', redirect);
    url.searchParams.set('state', nonce);
    location.assign(url.toString());
  });
})();
