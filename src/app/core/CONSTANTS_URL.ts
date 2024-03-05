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

export const IMAGES_URL = isDev
  ? `https://lalvirtual.edu.co/8myvc/public/images/perfil`
  : `${BASE_URL}/8myvc/public/images/perfil`;

export const GENDER_URL = isDev
  ? {
      M: `https://casb.micolevirtual.com/8myvc/public/images/perfil/default_male.png`,
      F: `https://casb.micolevirtual.com/8myvc/public/images/perfil/default_female.png`,
    }
  : {
      M: `${BASE_URL}/8myvc/public/images/perfil/default_male.png`,
      F: `${BASE_URL}/8myvc/public/images/perfil/default_female.png`,
    };
