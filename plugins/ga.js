import { get } from 'tiny-cookie';
import { supportsLocalStorage } from '~/mixins/Functions';

/* eslint-disable */
export default ({ app }) => {
  /*
  ** Only run on client-side and only in production mode
  */
  if (process.env.NODE_ENV !== 'production') return;

  /*
  ** Only run if the user has accepted cookies
  */
  let cookieconsent;

  if (supportsLocalStorage()) {
    cookieconsent = localStorage.getItem('cookieconsent');
  } else {
    cookieconsent = get('cookieconsent');
  }

  if (cookieconsent !== 'accepted') return;
}