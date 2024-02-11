const { hostname } = window.location;

const isDev = hostname === 'localhost';

export const BACK_URL = isDev
  ? 'http://localhost/api'
  : `https://${hostname}/8myvc/public/api`;
