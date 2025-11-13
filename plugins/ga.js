import { get } from 'tiny-cookie';
import { supportsLocalStorage } from '~/mixins/Functions';

/* eslint-disable */
export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return;
  let cookieconsent;

  if (supportsLocalStorage()) {
    cookieconsent = localStorage.getItem('cookieconsent');
  } else {
    cookieconsent = get('cookieconsent');
  }

  if (cookieconsent !== 'accepted') return;
}