
<template>
  <main class="main">
    <section class="terms-section">
      <UserNav @show-rated-modal="showRatedItems" />
      <br>
      <h1 class="title-primary text-center" style="font-size: 20px; margin-top: 10px;"><b>Acuerdo de Uso y Politicas de Privacidad</b></h1>
      <br>
      <div class="policy-content">
        <h3 class="title-secondary custom-center" style="font-size: 12px; position:relative; bottom:15px;"><strong>Vigencia desde:</strong> 27 de marzo de 2024</h3>
        
        <h3 class="section-title custom-center"><strong>1. INTRODUCCIÓN</strong></h3>
        <p class="policy-text custom-center">ESTA PLATAFORMA TÉCNICA DEMOSTRATIVA, PROPORCIONADA SIN NINGÚN TIPO DE GARANTÍA, ESTÁ DESTINADA ÚNICAMENTE AL USO PERSONAL EN LÍNEA, CON FINES NO COMERCIALES Y SIN ÁNIMO DE LUCRO. LEA COMPLETAMENTE ESTE ACUERDO ANTES DE UTILIZAR LA PLATAFORMA. AL ACCEDER O UTILIZAR ESTA PLATAFORMA —INCLUIDOS SU DOMINIO, CONTENIDO O CUALQUIER INTERACCIÓN (COMO HACER CLIC EN ENLACES)— USTED RECONOCE Y DECLARA QUE ACEPTA ESTE ACUERDO DE USUARIO Y QUE TIENE 18 AÑOS DE EDAD O MÁS. SU ACCESO Y USO IMPLICAN LA ACEPTACIÓN PLENA Y SIN MODIFICACIONES DE TODOS LOS TÉRMINOS Y CONDICIONES AQUÍ ESTABLECIDOS, LOS CUALES ENTRAN EN VIGOR DE INMEDIATO.</p>
        <p class="policy-text custom-center">Si no está de acuerdo con estos términos, simplemente absténgase de utilizar la plataforma y cierre todas sus ventanas. No podrá acceder ni utilizar esta plataforma si usted (o su tutor legal) no puede celebrar un contrato vinculante, o en cualquier jurisdicción donde este acuerdo no sea exigible. Al permitir el acceso a la plataforma desde su dispositivo o red, usted manifiesta su conformidad con las presentes Políticas de Uso.</p>
        <p class="policy-text custom-center">El usuario se compromete a utilizar la plataforma únicamente conforme a las leyes aplicables y a los derechos aquí establecidos. No está permitido: -INTENTAR VULNERAR O INTERFERIR CON LAS MEDIDAS DE SEGURIDAD DE LA PLATAFORMA. -USARLA DE FORMA QUE PUEDA DAÑARLA O AFECTAR SU RENDIMIENTO. -DESENSAMBLAR, DESCOMPILAR O REALIZAR INGENIERÍA INVERSA SOBRE NINGUNA PARTE DE LA MISMA.</p>
        
        <h3 class="section-title custom-center"><strong>2. EXENCIÓN DE RESPONSABILIDAD SOBRE EL USO</strong></h3>
        <p class="policy-text custom-center">EnterCinema recopila y presenta información de entretenimiento disponible públicamente para ofrecer resultados de búsqueda, recomendaciones y metadatos sobre películas y series. Si bien se procura garantizar la exactitud y relevancia de los datos, ocasionalmente pueden aparecer errores, información incompleta o descripciones de contenido que incluyan contenido maduro.</p>
        <p class="policy-text custom-center">Esta plataforma cuenta con Inteligencia Artificial incorporada que funciona mediante la <strong>API oficial de Google Gemini</strong>. Las respuestas generadas por inteligencia artificial pueden contener imprecisiones o interpretaciones erróneas. EnterCinema ofrece estas respuestas "tal cual", sin garantía alguna de exactitud o integridad.</p>
        <p class="policy-text custom-center">El uso e interpretación de cualquier resultado generado por IA, metadato o información de terceros es responsabilidad exclusiva del usuario. <strong>EN NINGÚN CASO EnterCinema, SUS COLABORADORES O AFILIADOS SERÁN RESPONSABLES DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS QUE SURJAN DEL USO DE LA PLATAFORMA, DE SUS FUNCIONES DE IA O DE CUALQUIER DATO PROCESADO A TRAVÉS DE ELLA.</strong></p>
        
        <h3 class="section-title custom-center"><strong>3. ENLACES EXTERNOS Y CONTENIDO DE TERCEROS</strong></h3>
        <p class="policy-text custom-center">Algunas secciones de esta plataforma pueden incluir referencias externas generados automáticamente hacia dominios o aplicaciones de terceros donde podría encontrarse contenido audiovisual o metadatos relacionados. Dichos enlaces se generan de forma programática mediante APIs de código abierto o protocolos estándar, basados en identificadores públicos (por ejemplo, identificadores de IMDb), y se ofrecen <strong>exclusivamente con fines informativos y de indexación</strong>.</p>
        <p class="policy-text custom-center">EnterCinema no aloja, almacena, transmite ni reproduce contenidos audiovisuales. La plataforma funciona únicamente como un <strong>indexador sin fines de lucro de información de acceso público</strong>. Las URL externas o los enlaces de protocolo (como aquellos que pueden abrir aplicaciones de medios externas) se muestran automáticamente como parte de los metadatos obtenidos de fuentes públicas, sin selección ni intervención manual.</p>
        <p class="policy-text custom-center">El acceso a cualquier dominio externo, servicio de streaming o plataforma de medios de terceros a través de enlaces mostrados en EnterCinema es completamente opcional y queda bajo la exclusiva responsabilidad del usuario. EnterCinema no tiene control técnico ni editorial sobre la legalidad, el contenido o el funcionamiento de esos destinos y <strong>NO PROMUEVE, FOMENTA NI RESPALDA NINGUNA FORMA DE INFRACCIÓN DE DERECHOS DE AUTOR NI DE DISTRIBUCIÓN NO AUTORIZADA DE contenidos PROTEGIDAS</strong>.</p>
        <p class="policy-text custom-center">Cualquier visualización, transmisión o descarga de contenido que ocurra tras seguir un enlace externo se rige exclusivamente por los términos de servicio, políticas de privacidad y leyes aplicables del sitio o servicio correspondiente. EnterCinema y sus colaboradores no asumen responsabilidad alguna por la naturaleza, exactitud o legalidad del contenido de terceros ni por las consecuencias derivadas del acceso del usuario a dichos sitios.</p>
        <p class="policy-text custom-center">Estas referencias externas se incluyen <strong>de buena fe</strong> con el único propósito de enriquecer la experiencia del usuario, conectándolo con fuentes legítimas de metadatos e información contextual. La intención de la plataforma es <strong>facilitar el descubrimiento, no la distribución</strong>.</p>
        
        <h3 class="section-title custom-center"><strong>4. POLÍTICA DE PRIVACIDAD</strong></h3>
        <p class="policy-text custom-center">EnterCinema no vende ni comparte información personal con fines comerciales. Los datos que el usuario proporcione de manera voluntaria (por ejemplo, durante el registro o autenticación) se utilizan únicamente para ofrecer funciones personalizadas como listas, preferencias o sincronización de cuenta.</p>
        <p class="policy-text custom-center">La autenticación se gestiona mediante <strong>Google OAuth</strong> y sistemas nativos de registro. No se comparte información sensible con terceros. Las interacciones con la IA se procesan a través de la <strong>API de Google Gemini</strong> y se rigen por los <a href="https://ai.google.dev/gemini-api/terms" target="_blank">Términos del API de Gemini</a> y las <a href="https://ai.google.dev/gemini-api/docs/usage-policies" target="_blank">Políticas de uso</a>.</p>
        <p class="policy-text custom-center">EnterCinema puede registrar datos analíticos anónimos con el fin de mejorar la experiencia de uso, pero nunca realiza perfilamientos individuales ni identifica usuarios.</p>
        
        <h3 class="section-title custom-center"><strong>5. FUENTES DE DATOS Y ATRIBUCIONES</strong></h3>
        <p class="policy-text custom-center">La plataforma integra información proveniente de diversas APIs públicas y proveedores de metadatos. Todas las marcas, logotipos y activos son propiedad de sus respectivos titulares. Los datos se muestran bajo criterios de uso legítimo y sin fines comerciales.</p>
        <p class="policy-text custom-center"><strong>Agregación de Noticias e Integridad del Tráfico:</strong> Los titulares de noticias, resúmenes y miniaturas asociadas se agregan a partir de fuentes RSS públicas estrictamente con <strong>fines de indexación y descubrimiento</strong>. EnterCinema opera bajo una estricta <strong>política de no modificación</strong>: el contenido se muestra exactamente tal como lo suministra la fuente de origen, sin alteraciones editoriales. <strong>No ofrecemos un lector interno, páginas almacenadas en caché ni modos de lectura simplificada.</strong> Es imposible acceder o leer el contenido completo del artículo dentro de la infraestructura de EnterCinema; cualquier interacción con una noticia redirige al usuario automática e inmediatamente a la <strong>plataforma web de la publicación original</strong>, garantizando que el 100% del tráfico, las impresiones publicitarias y la monetización permanezcan con el propietario del contenido. Las imágenes en miniatura se muestran bajo los principios de Uso Justo (<em>Fair Use</em>) únicamente para fines de identificación visual. Funcionamos como un conducto técnico neutral para conectar a los lectores con el periodismo original. Los editores que deseen excluir su contenido (<em>opt-out</em>) pueden ponerse en contacto con nosotros en la dirección de correo electrónico indicada en la <strong>Sección 8</strong>.</p>
        <p class="policy-text custom-center">Los iconos y SVG están bajo licencia de Creative Commons Attribution 4.0 International License. Atribución: Font Awesome Free 5.2.0 by @FontAwesome. Obtenga más información en <a href="https://fontawesome.com" target="_blank">Font Awesome</a>, CC BY 4.0 a través de Wikimedia Commons. Los datos sobre películas y programas de televisión son proporcionados por <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>. Los datos sobre proveedores de transmisión, redes y plataformas son proporcionados por <a href="https://www.justwatch.com" target="_blank">JustWatch</a>. Los datos adicionales son proporcionados por <a href="https://mdblist.com" target="_blank">MDBList</a>. Las reseñas de películas y series están complementadas por <a href="https://trakt.tv" target="_blank">Trakt</a>.</p>
        
        <h3 class="section-title custom-center"><strong>6. CONDICIONES GENERALES</strong></h3>
        <p class="policy-text custom-center">EnterCinema es un proyecto demostrativo sin fines de lucro en desarrollo continuo y se reserva el derecho de actualizar o modificar estas Políticas de Uso en cualquier momento sin previo aviso. El uso continuado de la plataforma implica la aceptación de la versión más reciente de este acuerdo.</p>
        
        <h3 class="section-title custom-center"><strong>7. USO DE COOKIES</strong></h3>
        <p class="policy-text custom-center">AL UTILIZAR NUESTRO SITIO WEB, USTED ACEPTA EL USO DE COOKIES. NUESTRA POLÍTICA DE COOKIES PROPORCIONA DETALLES SOBRE QUÉ SON LAS COOKIES, CÓMO LAS UTILIZAMOS, LA PARTICIPACIÓN DE SOCIOS DE TERCEROS, SUS OPCIONES DE COOKIES Y INFORMACIÓN ADICIONAL. LAS COOKIES SON PEQUEÑOS FRAGMENTOS DE TEXTO ENVIADOS A SU NAVEGADOR WEB DESDE UN SITIO WEB VISITADO. SE ALMACENAN EN SU NAVEGADOR, PERMITIENDO QUE EL SITIO WEB O TERCEROS LO RECONOZCAN, SIMPLIFICANDO SUS VISITAS SUBSECUENTES Y MEJORANDO LA UTILIDAD DEL SITIO WEB. DURANTE SU USO DEL SITIO WEB, PODEMOS COLOCAR VARIOS ARCHIVOS DE COOKIES EN SU NAVEGADOR WEB, QUE SIRVEN PARA FINES ESENCIALES Y ANALÍTICOS. ADEMÁS DE LOS NUESTROS, PODEMOS UTILIZAR COOKIES DE TERCEROS PARA INFORMAR ESTADÍSTICAS DE USO DEL SITIO WEB, ENTREGAR ANUNCIOS, ETC. SI DESEA ELIMINAR O RECHAZAR LAS COOKIES, CONSULTE LAS PÁGINAS DE AYUDA DE SU NAVEGADOR. TENGA EN CUENTA QUE TALES ACCIONES PUEDEN LIMITAR FUNCIONES, ALMACENAMIENTO DE PREFERENCIAS Y VISUALIZACIÓN DE PÁGINAS. PARA NAVEGADORES POPULARES COMO GOOGLE CHROME, OPERA, MOZILLA FIREFOX Y SAFARI, PUEDE ENCONTRAR INSTRUCCIONES ESPECÍFICAS EN SUS RESPECTIVAS PÁGINAS DE SOPORTE. EXPLORE <a href="https://allaboutcookies.org" target="_blank">ALLABOUTCOOKIES.ORG</a> Y <a href="https://networkadvertising.org" target="_blank">NETWORKADVERTISING.ORG</a> PARA OBTENER INFORMACIÓN COMPRENSIVA.</p>
        
        <h3 class="section-title custom-center"><strong>8. CONTACTO</strong></h3>
        <p class="policy-text custom-center">PARA CUALQUIER CONSULTA O DUDA SOBRE ESTE ACUERDO DE USUARIO, TÉRMINOS Y CONDICIONES O POLÍTICAS DE PRIVACIDAD, POR FAVOR ENVÍE UN CORREO ELECTRÓNICO A <strong>hello@entercinema.com.</strong></p>
        
        <h3 class="title-secondary custom-center" style="font-size: 12px; margin-top:20px;"><strong>Última actualización:</strong> 20 de diciembre del 2025</h3>
      </div>

    </section>
  </main>  
</template>
<script>
import UserNav from '@/components/global/UserNav';

export default {
  head () {
    return {
      title: 'EnterCinema - Usage Policies & Privacy Agreement.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Usage Policies & Privacy Agreement' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },
  components: {
    UserNav,
  },

  methods: {
    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
  },
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
    border-radius: 15px;;
  }

  .policy-text {
    text-align: justify;
    letter-spacing: 2px;
    font-size: 11px;
    text-transform: uppercase;
    margin: 0 auto; 
    max-width: 800px; 
    margin-bottom: 20px; 
  }

  .section-title {
    text-align: center;
    letter-spacing: 2px;
    font-size: 12px;
    text-transform: uppercase;
    margin: 0 auto; 
    max-width: 800px; 
    margin-bottom: 20px; 
  }

  .custom-center {
    text-align: center;
  }
</style>
