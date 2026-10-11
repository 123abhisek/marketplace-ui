// src/utils/appMode.js

/**
 * Determines whether the user is viewing the website from within the EasyDealWorld mobile app.
 * Uses query parameter, localStorage/sessionStorage persistence, User-Agent, and window flags.
 * @returns {boolean}
 */
export function isAppMode() {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Check URL query parameters (e.g. ?appMode=true, ?app=true, ?mode=app)
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('appMode') === 'true' ||
      params.get('app') === 'true' ||
      params.get('mode') === 'app'
    ) {
      localStorage.setItem('easydeal_app_mode', 'true');
      sessionStorage.setItem('easydeal_app_mode', 'true');
      return true;
    }

    // 2. Check persisted app mode flag
    if (
      localStorage.getItem('easydeal_app_mode') === 'true' ||
      sessionStorage.getItem('easydeal_app_mode') === 'true'
    ) {
      return true;
    }

    // 3. Check User-Agent identifier set by mobile app WebView
    if (
      navigator.userAgent &&
      navigator.userAgent.includes('EasyDealMobileApp')
    ) {
      localStorage.setItem('easydeal_app_mode', 'true');
      return true;
    }

    // 4. Check explicit window or DOM class flag
    if (
      window.isEasyDealApp === true ||
      document.body?.classList.contains('easydeal-app-mode') ||
      document.documentElement?.classList.contains('easydeal-app-mode')
    ) {
      return true;
    }
  } catch (e) {
    // Graceful fallback for restricted environments
  }

  return false;
}

/**
 * Determines whether the device is an Android/iOS mobile device or running inside the mobile app.
 * @returns {boolean}
 */
export function isMobileOrApp() {
  if (typeof window === 'undefined') return false;
  if (isAppMode()) return true;
  const ua = navigator.userAgent || '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

