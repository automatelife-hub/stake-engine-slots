import App from './App.svelte';
import { mount } from 'svelte';
import { initRgs } from './game/rgs-client';

// Parse Stake Engine query params
const params = new URLSearchParams(window.location.search);
const sessionID = params.get('sessionID') ?? '';
const lang = params.get('lang') ?? 'en';
const device = (params.get('device') as 'mobile' | 'desktop') ?? 'desktop';
const rgsUrl = params.get('rgs_url') ?? '';

if (sessionID && rgsUrl) {
  initRgs(rgsUrl, sessionID);
}

document.documentElement.lang = lang;
document.documentElement.dataset.device = device;

const app = mount(App, { target: document.getElementById('app')! });

export default app;
