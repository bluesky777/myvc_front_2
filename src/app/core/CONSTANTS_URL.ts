const { hostname } = window.location;

export const isDev = hostname === 'localhost';

export const BASE_URL = isDev ? 'http://localhost' : `https://${hostname}`;

export const FRONT_URL = isDev ? `${BASE_URL}` : `${BASE_URL}/plus`;

export const BACK_URL = isDev
  ? `${BASE_URL}/api`
  : `${BASE_URL}/8myvc/public/api`;

export const UPLOADS_URL = isDev
  ? `${BASE_URL}/uploads`
  : `${BASE_URL}/8myvc/public/uploads`;
