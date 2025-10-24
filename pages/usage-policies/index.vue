<template>
  <main class="main">
    <section class="terms-section">
      <div class="user-profile">
        <div class="language-selector" style="position: relative; top: 43px;"> 
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-right: 4px; width: 13px; height: 13px; margin-right: 4px;">
            <span class="language">Es</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'español'" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1" @click="changeLanguage('english')">
              <span>English</span>
            </label>
          </div>
        </div>
      </div> 
      <br>
      <h1 class="text-white text-center"><b>Políticas de Uso y Acuerdo de Privacidad</b></h1>
      <br>
      <div>
        <h2 class="text-center custom-center"><strong>Fecha de entrada en vigor:</strong> 27 de marzo de 2024</h2>
        <h2 class="text-center custom-center"><strong>Última actualización:</strong> 24 de octubre de 2025</h2>
        <h2 class="text-center custom-center"><strong>1. INTRODUCCIÓN</strong></h2>
        <h2 class="text-center">ESTA PLATAFORMA TÉCNICA DEMOSTRATIVA, PROPORCIONADA SIN NINGÚN TIPO DE GARANTÍA, ESTÁ DESTINADA ÚNICAMENTE AL USO PERSONAL EN LÍNEA, CON FINES NO COMERCIALES Y SIN ÁNIMO DE LUCRO. LEA COMPLETAMENTE ESTE ACUERDO ANTES DE UTILIZAR LA PLATAFORMA. AL ACCEDER O UTILIZAR ESTA PLATAFORMA —INCLUIDOS SU DOMINIO, CONTENIDO O CUALQUIER INTERACCIÓN (COMO HACER CLIC EN ENLACES)— USTED RECONOCE Y DECLARA QUE ACEPTA ESTE ACUERDO DE USUARIO Y QUE TIENE 18 AÑOS DE EDAD O MÁS. SU ACCESO Y USO IMPLICAN LA ACEPTACIÓN PLENA Y SIN MODIFICACIONES DE TODOS LOS TÉRMINOS Y CONDICIONES AQUÍ ESTABLECIDOS, LOS CUALES ENTRAN EN VIGOR DE INMEDIATO.</h2>
        <h2 class="text-center">Si no está de acuerdo con estos términos, simplemente absténgase de utilizar la plataforma y cierre todas sus ventanas. No podrá acceder ni utilizar esta plataforma si usted (o su tutor legal) no puede celebrar un contrato vinculante, o en cualquier jurisdicción donde este acuerdo no sea exigible. Al permitir el acceso a la plataforma desde su dispositivo o red, usted manifiesta su conformidad con las presentes Políticas de Uso.</h2>
        <h2 class="text-center">El usuario se compromete a utilizar la plataforma únicamente conforme a las leyes aplicables y a los derechos aquí establecidos. No está permitido: -INTENTAR VULNERAR O INTERFERIR CON LAS MEDIDAS DE SEGURIDAD DE LA PLATAFORMA. -USARLA DE FORMA QUE PUEDA DAÑARLA O AFECTAR SU RENDIMIENTO. -DESENSAMBLAR, DESCOMPILAR O REALIZAR INGENIERÍA INVERSA SOBRE NINGUNA PARTE DE LA MISMA.</h2>
        <h2 class="text-center custom-center"><strong>2. EXENCIÓN DE RESPONSABILIDAD SOBRE EL USO</strong></h2>
        <h2 class="text-center">EnterCinema recopila y presenta información de entretenimiento disponible públicamente para ofrecer resultados de búsqueda, recomendaciones y metadatos sobre películas y series. Si bien se procura garantizar la exactitud y relevancia de los datos, ocasionalmente pueden aparecer errores, información incompleta o descripciones de contenido que incluyan contenido maduro.</h2>
        <h2 class="text-center">Esta plataforma cuenta con Inteligencia Artificial incorporada que funciona mediante la <strong>API oficial de Google Gemini</strong>. Las respuestas generadas por inteligencia artificial pueden contener imprecisiones o interpretaciones erróneas. EnterCinema ofrece estas respuestas "tal cual", sin garantía alguna de exactitud o integridad.</h2>
        <h2 class="text-center">El uso e interpretación de cualquier resultado generado por IA, metadato o información de terceros es responsabilidad exclusiva del usuario. <strong>EN NINGÚN CASO EnterCinema, SUS COLABORADORES O AFILIADOS SERÁN RESPONSABLES DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS QUE SURJAN DEL USO DE LA PLATAFORMA, DE SUS FUNCIONES DE IA O DE CUALQUIER DATO PROCESADO A TRAVÉS DE ELLA.</strong></h2>
        <h2 class="text-center custom-center"><strong>3. ENLACES EXTERNOS Y CONTENIDO DE TERCEROS</strong></h2>
        <h2 class="text-center">Algunas secciones de esta plataforma pueden incluir referencias externas generados automáticamente hacia dominios o aplicaciones de terceros donde podría encontrarse contenido audiovisual o metadatos relacionados. Dichos enlaces se generan de forma programática mediante APIs de código abierto o protocolos estándar, basados en identificadores públicos (por ejemplo, identificadores de IMDb), y se ofrecen <strong>exclusivamente con fines informativos y de indexación</strong>.</h2>
        <h2 class="text-center">EnterCinema no aloja, almacena, transmite ni reproduce contenidos audiovisuales. La plataforma funciona únicamente como un <strong>indexador sin fines de lucro de información de acceso público</strong>. Las URL externas o los enlaces de protocolo (como aquellos que pueden abrir aplicaciones de medios externas) se muestran automáticamente como parte de los metadatos obtenidos de fuentes públicas, sin selección ni intervención manual.</h2>
        <h2 class="text-center">El acceso a cualquier dominio externo, servicio de streaming o plataforma de medios de terceros a través de enlaces mostrados en EnterCinema es completamente opcional y queda bajo la exclusiva responsabilidad del usuario. EnterCinema no tiene control técnico ni editorial sobre la legalidad, el contenido o el funcionamiento de esos destinos y <strong>NO PROMUEVE, FOMENTA NI RESPALDA NINGUNA FORMA DE INFRACCIÓN DE DERECHOS DE AUTOR NI DE DISTRIBUCIÓN NO AUTORIZADA DE contenidos PROTEGIDAS</strong>.</h2>
        <h2 class="text-center">Cualquier visualización, transmisión o descarga de contenido que ocurra tras seguir un enlace externo se rige exclusivamente por los términos de servicio, políticas de privacidad y leyes aplicables del sitio o servicio correspondiente. EnterCinema y sus colaboradores no asumen responsabilidad alguna por la naturaleza, exactitud o legalidad del contenido de terceros ni por las consecuencias derivadas del acceso del usuario a dichos sitios.</h2>
        <h2 class="text-center">Estas referencias externas se incluyen <strong>de buena fe</strong> con el único propósito de enriquecer la experiencia del usuario, conectándolo con fuentes legítimas de metadatos e información contextual. La intención de la plataforma es <strong>facilitar el descubrimiento, no la distribución</strong>.</h2>
        <h2 class="text-center custom-center"><strong>4. POLÍTICA DE PRIVACIDAD</strong></h2>
        <h2 class="text-center">EnterCinema no vende ni comparte información personal con fines comerciales. Los datos que el usuario proporcione de manera voluntaria (por ejemplo, durante el registro o autenticación) se utilizan únicamente para ofrecer funciones personalizadas como listas, preferencias o sincronización de cuenta.</h2>
        <h2 class="text-center">La autenticación se gestiona mediante <strong>Google OAuth</strong> y sistemas nativos de registro. No se comparte información sensible con terceros. Las interacciones con la IA se procesan a través de la <strong>API de Google Gemini</strong> y se rigen por los <a href="https://ai.google.dev/gemini-api/terms" target="_blank">Términos del API de Gemini</a> y las <a href="https://ai.google.dev/gemini-api/docs/usage-policies" target="_blank">Políticas de uso</a>.</h2>
        <h2 class="text-center">EnterCinema puede registrar datos analíticos anónimos con el fin de mejorar la experiencia de uso, pero nunca realiza perfilamientos individuales ni identifica usuarios.</h2>
        <h2 class="text-center custom-center"><strong>5. FUENTES DE DATOS Y ATRIBUCIONES</strong></h2>
        <h2 class="text-center">La plataforma integra información proveniente de diversas APIs públicas y proveedores de metadatos. Todas las marcas, logotipos y activos son propiedad de sus respectivos titulares. Los datos se muestran bajo criterios de uso legítimo y sin fines comerciales.</h2>
        <h2 class="text-center">Los iconos y SVG están bajo licencia de Creative Commons Attribution 4.0 International License. Atribución: Font Awesome Free 5.2.0 by @FontAwesome. Obtenga más información en <a href="https://fontawesome.com" target="_blank">Font Awesome</a>, CC BY 4.0 a través de Wikimedia Commons. Los datos sobre películas y programas de televisión son proporcionados por <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>. Los datos sobre proveedores de transmisión, redes y plataformas son proporcionados por <a href="https://www.justwatch.com" target="_blank">JustWatch</a>. Los datos adicionales son proporcionados por <a href="https://mdblist.com" target="_blank">MDBList</a>.</h2>
        <h2 class="text-center custom-center"><strong>6. CONDICIONES GENERALES</strong></h2>
        <h2 class="text-center">EnterCinema es un proyecto demostrativo sin fines de lucro en desarrollo continuo y se reserva el derecho de actualizar o modificar estas Políticas de Uso en cualquier momento sin previo aviso. El uso continuado de la plataforma implica la aceptación de la versión más reciente de este acuerdo.</h2>
        <h2 class="text-center custom-center"><strong>7. USO DE COOKIES</strong></h2>
        <h2 class="text-center">AL UTILIZAR NUESTRO SITIO WEB, USTED ACEPTA EL USO DE COOKIES. NUESTRA POLÍTICA DE COOKIES PROPORCIONA DETALLES SOBRE QUÉ SON LAS COOKIES, CÓMO LAS UTILIZAMOS, LA PARTICIPACIÓN DE SOCIOS DE TERCEROS, SUS OPCIONES DE COOKIES Y INFORMACIÓN ADICIONAL. LAS COOKIES SON PEQUEÑOS FRAGMENTOS DE TEXTO ENVIADOS A SU NAVEGADOR WEB DESDE UN SITIO WEB VISITADO. SE ALMACENAN EN SU NAVEGADOR, PERMITIENDO QUE EL SITIO WEB O TERCEROS LO RECONOZCAN, SIMPLIFICANDO SUS VISITAS SUBSECUENTES Y MEJORANDO LA UTILIDAD DEL SITIO WEB. DURANTE SU USO DEL SITIO WEB, PODEMOS COLOCAR VARIOS ARCHIVOS DE COOKIES EN SU NAVEGADOR WEB, QUE SIRVEN PARA FINES ESENCIALES Y ANALÍTICOS. ADEMÁS DE LOS NUESTROS, PODEMOS UTILIZAR COOKIES DE TERCEROS PARA INFORMAR ESTADÍSTICAS DE USO DEL SITIO WEB, ENTREGAR ANUNCIOS, ETC. SI DESEA ELIMINAR O RECHAZAR LAS COOKIES, CONSULTE LAS PÁGINAS DE AYUDA DE SU NAVEGADOR. TENGA EN CUENTA QUE TALES ACCIONES PUEDEN LIMITAR FUNCIONES, ALMACENAMIENTO DE PREFERENCIAS Y VISUALIZACIÓN DE PÁGINAS. PARA NAVEGADORES POPULARES COMO GOOGLE CHROME, OPERA, MOZILLA FIREFOX Y SAFARI, PUEDE ENCONTRAR INSTRUCCIONES ESPECÍFICAS EN SUS RESPECTIVAS PÁGINAS DE SOPORTE. EXPLORE <a href="https://allaboutcookies.org" target="_blank">ALLABOUTCOOKIES.ORG</a> Y <a href="https://networkadvertising.org" target="_blank">NETWORKADVERTISING.ORG</a> PARA OBTENER INFORMACIÓN COMPRENSIVA.</h2>
        <h2 class="text-center custom-center"><strong>8. CONTACTO</strong></h2>
        <h2 class="text-center">PARA CUALQUIER CONSULTA O DUDA SOBRE ESTE ACUERDO DE USUARIO, TÉRMINOS Y CONDICIONES O POLÍTICAS DE PRIVACIDAD, POR FAVOR ENVÍE UN CORREO ELECTRÓNICO A <strong>hello@entercinema.com.</strong></h2>
      </div>
      <br>
      <div class="button-container">
        <button class="button button--icon" @click="redirectToHome">
          <span class="txt">Volver</span>
        </button>
      </div>
    </section>
  </main>  
</template>

<script>
export default {
  data() {
    return {
      showLanguageMenu: false,
      selectedLanguage: 'español',
    };
  },
  methods: {
    redirectToHome() {
      window.location.href = 'https://es.EnterCinema.com';
    },
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu;
      const menu = this.$refs.languageMenu;
      if (menu) {
        menu.style.display = this.showLanguageMenu ? 'block' : 'none';
      }
    },
    changeLanguage(language) {
      const currentPath = this.$route.path;
      const currentOrigin = window.location.origin;
      const isSpanish = currentOrigin.includes('es.');
      if (isSpanish) {
        const newOrigin = currentOrigin.replace('es.', '');
        const newUrl = `${newOrigin}${currentPath}`;
        window.location.href = newUrl;
      } else {
        console.log("La URL no tiene el prefijo 'es.', no se necesita ninguna acción.");
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  }
};
</script>

<style scoped>
  a {
    font-weight: 600;
    color: #80868b;
    text-decoration: none;
  }

  a:hover {
    color: #ffffff;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px; 
    letter-spacing: 2px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .terms-section {
    padding: 10px;
  }

  .button {
    border-radius: 10px;
  }

  h2 {
    text-align: justify;
    letter-spacing: 2px;
    font-size: 11px;
    text-transform: uppercase;
    margin: 0 auto; 
    max-width: 800px; 
    margin-bottom: 20px; 
  }

  .custom-center {
    text-align: center;
  }

  .user-profile {
    position: absolute;
    right: 5%;
    top: -30px;
  }

  .language-selector {
    position: relative;
    cursor: pointer;
  }

  .selected-language {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 5px;
  }

  .language {
    margin-right: 0.5rem;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 11px; 
    text-transform: uppercase;
    border-radius: 15px;
    color: #94999d;
    position: relative;
    top: 1px;
  }

  .language-menu {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    z-index: 1000;
    display: none;
  }

  .language-menu label {
    display: block;
    padding: 0.5rem;
    cursor: pointer;
  }

  .language-menu.active {
    display: block;
  }

  .menu-label1 {
    color: #94999d;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative; 
    top: 1px;
  }

  .menu-label1:hover {
    color: #ffffff;
  }
</style>