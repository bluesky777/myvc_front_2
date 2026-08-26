import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

/**
 * Saneado del HTML que produce el editor antes de pintarlo.
 *
 * **Por qué no basta con el sanitizador de Angular.** El esquema de ngx-editor
 * serializa el color y la alineación como estilos en línea —
 * `<span style="color:#f00;">`, `<p style="text-align:center">` — y Angular
 * borra el atributo `style` al pasar un string por `[innerHTML]`. Por eso el
 * código llamaba a `bypassSecurityTrustHtml`, que no borra nada: ni los estilos
 * ni un `<script>` o un `onerror=` guardados en la base de datos.
 *
 * Aquí se limpia con DOMPurify primero y se marca como confiable después. El
 * `bypass` sigue estando, pero ahora recibe HTML ya inspeccionado, que es la
 * diferencia entre confiar en el contenido y confiar en la limpieza.
 */

/** Lo que el esquema de ngx-editor puede generar. Nada más entra. */
const ETIQUETAS_PERMITIDAS = [
  'p', 'br', 'span', 'div',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'code', 'pre',
  'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'hr', 'img',
];

const ATRIBUTOS_PERMITIDOS = [
  'style', 'href', 'target', 'rel', 'title', 'src', 'alt', 'width', 'height',
];

/**
 * Las tres propiedades que el editor escribe. DOMPurify conserva el `style`
 * entero si se le permite, y con CSS libre se pueden montar superposiciones
 * sobre el resto de la página; la lista blanca deja pasar solo el formato.
 */
const CSS_PERMITIDO = new Set(['color', 'background-color', 'text-align']);

@Injectable({
  providedIn: 'root',
})
export class RichTextService {
  constructor(private sanitizer: DomSanitizer) {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      const elemento = node as HTMLElement;

      if (elemento.style && elemento.style.length > 0) {
        const declaraciones: string[] = [];

        for (let i = 0; i < elemento.style.length; i++) {
          const propiedad = elemento.style.item(i);
          if (CSS_PERMITIDO.has(propiedad)) {
            declaraciones.push(
              `${propiedad}:${elemento.style.getPropertyValue(propiedad)}`,
            );
          }
        }

        if (declaraciones.length > 0) {
          elemento.setAttribute('style', declaraciones.join(';'));
        } else {
          elemento.removeAttribute('style');
        }
      }

      // Un enlace a otra pestaña da acceso a `window.opener` sin esto.
      if (elemento.tagName === 'A' && elemento.getAttribute('target')) {
        elemento.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /** HTML listo para `[innerHTML]`, conservando el formato del editor. */
  sanitize(html?: string | null): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.clean(html));
  }

  /** El mismo saneado, en texto plano, para enviarlo al backend. */
  clean(html?: string | null): string {
    return DOMPurify.sanitize(html ?? '', {
      ALLOWED_TAGS: ETIQUETAS_PERMITIDAS,
      ALLOWED_ATTR: ATRIBUTOS_PERMITIDOS,
      ALLOW_DATA_ATTR: false,
    });
  }
}
