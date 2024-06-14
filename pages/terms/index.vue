<template>
  <main class="main">
    <section class="terms-section">
      <div class="user-profile">
        <div class="language-selector" @click="toggleLanguageMenu" style="position: relative; top: 43px;"> 
          <div class="selected-language">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-right: 4px; width: 13px; height: 13px; margin-right: 4px;">
            <span class="language">{{ selectedLanguage === 'english' ? 'En' : 'Es' }}</span>
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
      <h1 class="text-white text-center"><b>Acuerdo de Usuario / Términos y Condiciones / Política de Cookies.</b></h1>
      <br>
      <div>
        <h2 class="text-center custom-center"><strong>SÓLO PARA REFERENCIA EN LÍNEA. CADA ACCESO ES POR PERMISO ÚNICAMENTE.</strong></h2>
        <h2 class="text-center custom-center"><strong>1. USO DEL SITIO WEB</strong></h2>
        <h2 class="text-center">ESTE SITIO WEB TÉCNICO DEMOSTRATIVO, PROPORCIONADO SIN NINGUNA GARANTÍA, ESTÁ DESTINADO ÚNICAMENTE PARA VISUALIZACIÓN EN LÍNEA PERSONAL INMEDIATA, <a>SIN FINES COMERCIALES O DE LUCRO</a>. POR FAVOR, LEA TODO ESTE ACUERDO ANTES DE USAR ESTE SITIO WEB. AL ACCEDER O UTILIZAR ESTE SITIO WEB, INCLUYENDO SU NOMBRE DE DOMINIO(S) O DIRECCIONES IP, CONTENIDO, O CUALQUIER INTERACCIÓN (COMO HACER CLIC EN ENLACES), RECONOCE Y DECLARA QUE ACEPTA ESTE ACUERDO DE USUARIO. SU ACCESO Y USO INDICAN SU RECONOCIMIENTO, ACEPTACIÓN Y ACUERDO INCONDICIONAL A TODOS LOS TÉRMINOS Y CONDICIONES ESTABLECIDOS AQUÍ SIN MODIFICACIÓN, Y ESTE ACUERDO ENTRA EN VIGOR DE INMEDIATO. PARA RECHAZAR, SIMPLEMENTE ABSTÉNGASE DE USAR EL SITIO WEB Y CIERRE TODAS SUS VENTANAS. SIN EMBARGO, NO PODRÁ ACCEDER O UTILIZAR ESTE SITIO WEB SI USTED (O SU TUTOR O REPRESENTANTE LEGAL) NO PUEDE CELEBRAR UN CONTRATO VINCULANTE O EN CUALQUIER JURISDICCIÓN DONDE ESTE ACUERDO DE USUARIO NO SEA EJECUTABLE. USTED ACEPTA QUE SU USO CONSTITUYE EL RECONOCIMIENTO DE QUE HA LEÍDO, ENTENDIDO Y ACEPTADO TODOS LOS TÉRMINOS. SI USTED ES EL PROPIETARIO U OPERADOR DEL EQUIPO UTILIZADO PARA ACCEDER A ESTE SITIO WEB, AL PERMITIR DICHO USO, USTED CONSIENTE Y ACEPTA ESTAR SUJETO A LOS TÉRMINOS Y CONDICIONES DE ESTE ACUERDO DE USUARIO. SI ACTÚA EN NOMBRE DE ORGANIZACIONES, DECLARA QUE ESTÁ AUTORIZADO PARA ACTUAR COMO AGENTE Y ACEPTA ESTE ACUERDO DE USUARIO EN NOMBRE DE SU EMPLEADOR Y ORGANIZACIONES. USTED ACEPTA UTILIZAR EL SITIO WEB ÚNICAMENTE DE ACUERDO CON ESTOS DERECHOS DE USO Y TODAS LAS LEYES Y REGULACIONES APLICABLES. NO PUEDE: -INTENTAR ELUDIR LAS MEDIDAS DE SEGURIDAD DEL SITIO WEB. -UTILIZAR EL SITIO WEB DE MANERA QUE PUEDA DAÑARLO O AFECTAR SU RENDIMIENTO. -DESARMAR O DESCOMPILAR EL SITIO WEB.</h2>
        <h2 class="text-center custom-center"><strong>2. CRÉDITOS - ESTE PROYECTO ES UNA IMPLEMENTACIÓN</strong></h2>
        <h2 class="text-center">Este proyecto representa una implementación derivada del proyecto iniciado por 'TASTEJS': 
        <strong><a href="https://github.com/tastejs/nuxt-movies" target="_blank">'NUXT MOVIES'</a></strong></h2>
        <h2 class="text-center custom-center"><strong>3. DESCARGO DE RESPONSABILIDAD SOBRE EL USO DEL SITIO WEB</strong></h2>
        <h2 class="text-center">EL SITIO WEB SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD." CINEMATHE NO OFRECE GARANTÍAS, EXPRESAS O IMPLÍCITAS, SOBRE LA FUNCIONALIDAD, EXACTITUD O DISPONIBILIDAD DEL SITIO WEB. ADEMÁS, EN CASO DE CUALQUIER ATAQUE CIBERNÉTICO, VULNERABILIDAD DE SEGURIDAD O ACCESO NO AUTORIZADO AL SITIO WEB, CINEMATHE NO SERÁ RESPONSABLE DE DAÑOS, PÉRDIDAS O INTERRUPCIONES CAUSADAS POR ELLO. LOS USUARIOS RECONOCEN Y ACEPTAN QUE LA SEGURIDAD DEL SITIO WEB PUEDE SER COMPROMETIDA, Y UTILIZAN EL SITIO WEB BAJO SU PROPIO RIESGO EN TALES CIRCUNSTANCIAS. TOMAMOS MEDIDAS EXTENSAS Y CONTINUAS PARA GARANTIZAR LA SEGURIDAD DEL SITIO WEB, PERO NO GARANTIZAMOS SEGURIDAD ABSOLUTA. EL PANORAMA DE SEGURIDAD EN LÍNEA ES DESAFIANTE, Y NINGÚN SISTEMA PUEDE TIENE INMUNIDAD COMPLETA CONTRA RIESGOS. POR FAVOR, TENGA EN CUENTA QUE NUESTRO OBJETIVO PRINCIPAL ES SALVAGUARDAR LA INTEGRIDAD DE LA APLICACIÓN WEB Y SU EXPERIENCIA CON ELLA. ESTAMOS COMPROMETIDOS A GARANTIZAR UN ENTORNO SEGURO PARA SU USO. ES ESENCIAL QUE LOS USUARIOS TOMEN PRECAUCIONES, COMO VERIFICAR LOS ENLACES QUE UTILIZAN Y UTILIZAR DISPOSITIVOS Y REDES ACTUALIZADOS Y SEGURAS. EN EL IMPROBABLE CASO DE CUALQUIER INCIDENTE DE SEGURIDAD, INVESTIGAREMOS INMEDIATAMENTE, TOMAREMOS LAS ACCIONES NECESARIAS Y LO MANTENDREMOS INFORMADO. ESTA DESCARGO SE EXTIENDE A CUALQUIER IMPACTO POTENCIAL EN LOS DATOS DEL USUARIO, LA INTEGRIDAD DEL SISTEMA O EL RENDIMIENTO GENERAL DEL SITIO WEB RESULTANTE DE ACTIVIDADES MALICIOSAS EXTERNAS. SE ACONSEJA A LOS USUARIOS QUE UTILICEN EL SITIO WEB CON CONCIENCIA DE LOS POSIBLES RIESGOS DE SEGURIDAD Y TOMEN LAS MEDIDAS NECESARIAS PARA PROTEGER SUS DATOS Y DISPOSITIVOS. </h2>
        <h2 class="text-center custom-center"><strong>4. USO RESPONSABLE DE CINEMATHE Y MEJORES PRÁCTICAS. AVISO IMPORTANTE:</strong></h2>
        <h2 class="text-center">AL UTILIZAR CINEMATHE, EL USUARIO RECONOCE Y ACEPTA QUE LA FUNCIONALIDAD DE ESTE SITIO WEB ESTÁ DISEÑADA EXCLUSIVAMENTE SIN FINES COMERCIALES O DE LUCRO, PARA PRESENTACIÓN A RECLUTADORES. EL PROYECTO CINEMATHE NO ESTÁ CERTIFICADO POR TMDB. YA  QUE ES DEMOSTRATIVO Y CON FINES DE APRENDIZAJE A PARTIR DE DATOS PROPORCIONADOS POR LA API DE TMDB PARA DESARROLLADORES. CINEMATHE, SU EQUIPO DE DESARROLLO Y CUALQUIER ENTIDAD RELACIONADA NO ASUMEN NINGUNA RESPONSABILIDAD POR EL USO INDEBIDO DE LA API DE TMDB O CUALQUIER OTRO ASPECTO DE LA FUNCIONALIDAD DEL SITIO. LA RESPONSABILIDAD RECAE ÚNICAMENTE EN EL USUARIO, QUE DEBE UTILIZAR LA PLATAFORMA DE MANERA RESPONSABLE Y ADHERIRSE A LAS MEJORES PRÁCTICAS EN LÍNEA CUANDO UTILICE LOS DATOS OBTENIDOS DE LA API DE TMDB. ES CRUCIAL RECONOCER QUE CUALQUIER USO INDEBIDO DE LA FUNCIONALIDAD VA MÁS ALLÁ DE NUESTRO PROPÓSITO. POR FAVOR, CONSIDERE LAS SIGUIENTES MEJORES PRÁCTICAS: EVITE UTILIZAR ESTA APLICACIÓN WEB PARA ACTIVIDADES ILEGALES O MALICIOSAS. NO UTILICE CINEMATHE EN ENTORNOS CRÍTICOS O CON EXPECTATIVAS DE FUNCIONAMIENTO ACTIVO. SU COMPRENSIÓN Y CUMPLIMIENTO DE ESTAS DIRECTRICES SON CRUCIALES PARA EL USO RESPONSABLE DE CINEMATHE. APRECIAMOS SU COOPERACIÓN Y ESPERAMOS QUE DISFRUTE DE LA EXPERIENCIA DEMOSTRATIVA DE NUESTRO SERVICIO.</h2>
        <h2 class="text-center custom-center"><strong>5. ATRIBUCIONES:</strong></h2>
        <h2 class="text-center">
            Los iconos y SVG están bajo licencia de Creative Commons Attribution 4.0 International License. Atribución: Font Awesome Free 5.2.0 by @FontAwesome. Obtenga más información en <a href="https://fontawesome.com" target="_blank">Font Awesome</a>, CC BY 4.0 a través de Wikimedia Commons.
            Los datos sobre películas y programas de televisión son proporcionados por <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>. 
            Los datos sobre proveedores de transmisión, redes y plataformas son proporcionados por <a href="https://www.justwatch.com" target="_blank">JustWatch</a>.
        </h2>
        <h2 class="text-center custom-center"><strong>6. INFORMACIÓN QUE RECOPILAMOS</strong></h2>
        <h2 class="text-center">CINEMATHE PUEDE RECOPILAR Y ALMACENAR CIERTA INFORMACIÓN SOBRE SU USO DEL SITIO WEB. ESTO INCLUYE INFORMACIÓN NO PERSONAL COMO EL TIPO DE DISPOSITIVO, EL TIPO DE NAVEGADOR Y LOS PATRONES DE USO. NUESTRA POLÍTICA DE PRIVACIDAD (VER SECCIÓN 9) PROPORCIONA MÁS DETALLES SOBRE CÓMO MANEJAMOS ESTA INFORMACIÓN.</h2>
        <h2 class="text-center custom-center"><strong>7. MODIFICACIONES Y TERMINACIÓN</strong></h2>
        <h2 class="text-center">CINEMATHE SE RESERVA EL DERECHO DE MODIFICAR, SUSPENDER O TERMINAR EL SITIO WEB EN CUALQUIER MOMENTO SIN PREVIO AVISO.</h2>
        <h2 class="text-center custom-center"><strong>8. LIMITACIÓN DE RESPONSABILIDAD</strong></h2>
        <h2 class="text-center">CINEMATHE NO SERÁ RESPONSABLE DE NINGÚN DAÑO DIRECTO, INDIRECTO, INCIDENTAL, ESPECIAL O CONSECUENTE QUE SURJA DEL USO O LA IMPOSIBILIDAD DE USAR EL SITIO WEB.</h2>
        <h2 class="text-center custom-center"><strong>9. POLÍTICA DE PRIVACIDAD</strong></h2>
        <h2 class="text-center">AL UTILIZAR NUESTRO SITIO WEB, USTED ACEPTA EL USO DE COOKIES. NUESTRA POLÍTICA DE COOKIES PROPORCIONA DETALLES SOBRE QUÉ SON LAS COOKIES, CÓMO LAS UTILIZAMOS, LA PARTICIPACIÓN DE SOCIOS DE TERCEROS, SUS OPCIONES DE COOKIES Y INFORMACIÓN ADICIONAL. LAS COOKIES SON PEQUEÑOS FRAGMENTOS DE TEXTO ENVIADOS A SU NAVEGADOR WEB DESDE UN SITIO WEB VISITADO. SE ALMACENAN EN SU NAVEGADOR, PERMITIENDO QUE EL SITIO WEB O TERCEROS LO RECONOZCAN, SIMPLIFICANDO SUS VISITAS SUBSECUENTES Y MEJORANDO LA UTILIDAD DEL SITIO WEB. DURANTE SU USO DEL SITIO WEB, PODEMOS COLOCAR VARIOS ARCHIVOS DE COOKIES EN SU NAVEGADOR WEB, QUE SIRVEN PARA FINES ESENCIALES Y ANALÍTICOS. ADEMÁS DE LOS NUESTROS, PODEMOS UTILIZAR COOKIES DE TERCEROS PARA INFORMAR ESTADÍSTICAS DE USO DEL SITIO WEB, ENTREGAR ANUNCIOS, ETC. SI DESEA ELIMINAR O RECHAZAR LAS COOKIES, CONSULTE LAS PÁGINAS DE AYUDA DE SU NAVEGADOR. TENGA EN CUENTA QUE TALES ACCIONES PUEDEN LIMITAR FUNCIONES, ALMACENAMIENTO DE PREFERENCIAS Y VISUALIZACIÓN DE PÁGINAS. PARA NAVEGADORES POPULARES COMO GOOGLE CHROME, OPERA, MOZILLA FIREFOX Y SAFARI, PUEDE ENCONTRAR INSTRUCCIONES ESPECÍFICAS EN SUS RESPECTIVAS PÁGINAS DE SOPORTE. EXPLORE ALLABOUTCOOKIES.ORG Y NETWORKADVERTISING.ORG PARA OBTENER INFORMACIÓN COMPRENSIVA.</h2>
        <h2 class="text-center custom-center"><strong>10. CONTACTO</strong></h2>
        <h2 class="text-center">PARA CUALQUIER CONSULTA O DUDA SOBRE ESTE ACUERDO DE USUARIO, TÉRMINOS Y CONDICIONES O POLÍTICAS DE PRIVACIDAD, POR FAVOR ENVÍE UN CORREO ELECTRÓNICO A <strong>CONTACT@IVANLUNA.DEV.</strong></h2>
      </div>
      <br>
      <div class="button-container">
        <button class="button button--icon" @click="redirectToHome">
          <!-- eslint-disable-next-line -->
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
      window.location.href = 'https://es.cinemathe.space';
    },
    toggleLanguageMenu() {
          this.showLanguageMenu = !this.showLanguageMenu;
          const menu = this.$refs.languageMenu;
          if (menu) {
            menu.style.display = this.showLanguageMenu ? 'block' : 'none';
          }
        },

        changeLanguage(language) {
          this.selectedLanguage = language;
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
