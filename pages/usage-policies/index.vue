
<template>
  <main class="main">
    <section class="terms-section">
      <UserNav @show-rated-modal="showRatedItems" />
      <br>
      <h1 class="title-primary text-center" style="font-size: 20px; margin-top: 10px;"><b>Acuerdo de Uso y Politicas de Privacidad</b></h1>
      <br>
      <div>
        <h2 class="title-secondary custom-center" style="font-size: 12px; position:relative; bottom:15px;"><strong>Vigencia desde:</strong> 27 de marzo de 2024</h2>

        <h2 class="text-center custom-center"><strong>1. INTRODUCCIÓN</strong></h2>

        <h2 class="text-center">
          ESTA PLATAFORMA TÉCNICA DEMOSTRATIVA SE PROPORCIONA SIN GARANTÍAS DE NINGÚN TIPO Y ESTÁ DESTINADA EXCLUSIVAMENTE A USO PERSONAL EN LÍNEA, CON FINES NO COMERCIALES Y SIN ÁNIMO DE LUCRO. LEA DETENIDAMENTE ESTE ACUERDO ANTES DE UTILIZAR LA PLATAFORMA. AL ACCEDER O UTILIZAR ESTE SITIO —INCLUYENDO SU DOMINIO, CONTENIDO O CUALQUIER INTERACCIÓN— USTED DECLARA QUE ACEPTA ESTE ACUERDO DE USUARIO Y QUE TIENE 18 AÑOS DE EDAD O MÁS. EL USO DE LA PLATAFORMA IMPLICA LA ACEPTACIÓN PLENA Y SIN RESERVAS DE LOS PRESENTES TÉRMINOS Y CONDICIONES, QUE ENTRAN EN VIGOR DE FORMA INMEDIATA.
        </h2>

        <h2 class="text-center">
          El usuario se compromete a utilizar la plataforma conforme a la legislación aplicable y a los términos aquí establecidos. Queda prohibido: intentar vulnerar o interferir con los sistemas de seguridad; utilizar la plataforma de forma que afecte su funcionamiento o rendimiento; desensamblar, descompilar o realizar ingeniería inversa sobre cualquier componente de la misma.
        </h2>

        <h2 class="text-center">
          Si no está de acuerdo con estos términos, deberá abstenerse de utilizar la plataforma y cerrar todas sus ventanas.
        </h2>

        <h2 class="text-center custom-center"><strong>2. EXENCIÓN DE RESPONSABILIDAD SOBRE EL USO</strong></h2>

        <h2 class="text-center">
          Cinemagoria recopila y presenta información de entretenimiento disponible públicamente con el objetivo de ofrecer resultados de búsqueda, recomendaciones y metadatos sobre películas y series. Aunque se procura mantener la exactitud y relevancia de los datos, pueden existir errores, omisiones o referencias a contenido sensible o para adultos.
        </h2>

        <h2 class="text-center">
          El uso e interpretación de cualquier resultado, metadato o información de terceros es responsabilidad exclusiva del usuario. <strong>EN NINGÚN CASO Cinemagoria, SUS COLABORADORES O AFILIADOS SERÁN RESPONSABLES POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS DERIVADOS DEL USO DE LA PLATAFORMA O DE LOS DATOS PROCESADOS A TRAVÉS DE ELLA.</strong>
        </h2>

        <h2 class="text-center custom-center"><strong>3. ENLACES EXTERNOS Y CONTENIDO DE TERCEROS</strong></h2>

        <h2 class="text-center">
          Algunas secciones pueden incluir enlaces generados automáticamente hacia dominios o aplicaciones de terceros donde podría encontrarse contenido audiovisual o metadatos relacionados. Estos enlaces se generan de forma programática mediante APIs abiertas o protocolos estándar, basados en identificadores públicos (como IMDb ID), y se ofrecen <strong>exclusivamente con fines informativos y de indexación</strong>.
        </h2>

        <h2 class="text-center">
          Cinemagoria no aloja, almacena, transmite ni reproduce contenido audiovisual. La plataforma funciona únicamente como un <strong>indexador sin fines de lucro de información de acceso público</strong>. Las URL externas o enlaces de protocolo se muestran automáticamente como parte de metadatos obtenidos de fuentes públicas, sin intervención editorial.
        </h2>

        <h2 class="text-center">
          El acceso a servicios o plataformas externas es opcional y bajo exclusiva responsabilidad del usuario. Cinemagoria no ejerce control sobre la legalidad, contenido o funcionamiento de dichos servicios y <strong>NO PROMUEVE NI RESPALDA LA INFRACCIÓN DE DERECHOS DE AUTOR NI LA DISTRIBUCIÓN NO AUTORIZADA DE CONTENIDO PROTEGIDO</strong>.
        </h2>

        <h2 class="text-center">
          Cualquier acción realizada en sitios de terceros se rige por sus propios términos y políticas. Cinemagoria no asume responsabilidad por el contenido externo ni por las consecuencias derivadas de su acceso.
        </h2>

        <h2 class="text-center">
          Estas referencias se incluyen <strong>de buena fe</strong> con el objetivo de enriquecer la experiencia del usuario. La plataforma está orientada al descubrimiento, no a la distribución.
        </h2>

        <h2 class="text-center custom-center"><strong>4. POLÍTICA DE PRIVACIDAD</strong></h2>

        <h2 class="text-center">
          Cinemagoria no vende ni comparte datos personales con fines comerciales. La información proporcionada voluntariamente se utiliza exclusivamente para funcionalidades como listas, preferencias o sincronización de cuenta.
        </h2>

        <h2 class="text-center">
          La autenticación se gestiona mediante <strong>Google OAuth</strong> y sistemas propios. No se comparten datos sensibles con terceros.
        </h2>

        <h2 class="text-center">
          Pueden recopilarse datos analíticos anónimos con fines de mejora del servicio.
        </h2>

        <h2 class="text-center custom-center"><strong>5. FUENTES DE DATOS Y ATRIBUCIONES</strong></h2>

        <h2 class="text-center">
          La plataforma integra datos provenientes de APIs públicas y proveedores de metadatos. Todas las marcas y activos pertenecen a sus respectivos titulares. La información se presenta bajo criterios de uso legítimo y sin fines comerciales. Los titulares de derechos o editores que deseen solicitar la exclusión de su contenido (<em>opt-out</em>) pueden ponerse en contacto según lo indicado en la <strong>Sección 8</strong>.
        </h2>

        <h2 class="text-center">
          <strong>Cobertura de Datos de Festivales:</strong> Cinemagoria recopila programaciones a partir de fuentes públicas. La disponibilidad de datos puede ser incompleta, especialmente en el caso de cortometrajes. Como resultado, la cantidad de títulos mostrados para un festival puede diferir de su programación oficial. Estas diferencias responden a limitaciones técnicas y no a decisiones editoriales.
        </h2>

        <h2 class="text-center">
          <strong>Agregación de Noticias:</strong> Los contenidos se obtienen de fuentes RSS públicas con fines de indexación. Cinemagoria no modifica las noticias de origen y muestra únicamente la información proporcionada por dichas fuentes (como título, descripción y metadatos). No es posible leer artículos completos dentro de la plataforma: toda interacción redirige al sitio original, siendo este el único entorno donde puede accederse al contenido íntegro, garantizando que el tráfico, las impresiones y la monetización correspondan exclusivamente al medio editorial. Adicionalmente, la plataforma puede publicar contenidos editoriales propios generados de forma automatizada o asistida, los cuales se ofrecen con fines informativos y pueden contener errores, omisiones o imprecisiones. Las imágenes se utilizan únicamente con fines de identificación bajo principios de uso legítimo.
        </h2>

        <h2 class="text-center">
          Iconos y recursos gráficos bajo licencia Creative Commons Attribution 4.0. Datos proporcionados por TMDB, JustWatch, MDBList y Trakt.
        </h2>

        <h2 class="text-center custom-center"><strong>6. CONDICIONES GENERALES</strong></h2>

        <h2 class="text-center">
          Cinemagoria es un proyecto en desarrollo continuo y se reserva el derecho de modificar estos términos en cualquier momento. El uso continuado implica la aceptación de la versión vigente.
        </h2>

        <h2 id="cookies" class="text-center custom-center"><strong>7. USO DE COOKIES</strong></h2>

        <h2 class="text-center">
          Esta plataforma utiliza cookies y tecnologías similares de almacenamiento local. Puedes gestionar tus preferencias en cualquier momento desde el enlace de configuración de cookies en el pie de página o el banner de consentimiento mostrado en tu primera visita.
        </h2>

        <div class="cookie-table-wrapper">
          <table class="cookie-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Propósito</th>
                <th>Ejemplos</th>
                <th>Duración</th>
                <th>Obligatoria</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Esenciales</strong></td>
                <td>Autenticación, gestión de sesión, seguridad y funcionalidad básica del sitio</td>
                <td>Tokens de inicio de sesión, protección CSRF, preferencias de consentimiento</td>
                <td>Sesión – 1 año</td>
                <td>Sí</td>
              </tr>
              <tr>
                <td><strong>Analíticas</strong></td>
                <td>Estadísticas de uso para entender cómo se utiliza la plataforma e identificar áreas de mejora</td>
                <td>Páginas visitadas, patrones de navegación, uso de funciones</td>
                <td>Hasta 2 años</td>
                <td>No — opt-in</td>
              </tr>
              <tr>
                <td><strong>Personalización</strong></td>
                <td>Recuerda preferencias y contexto de navegación para una experiencia adaptada</td>
                <td>Secciones visitadas recientemente</td>
                <td>Hasta 1 año</td>
                <td>No — opt-in</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 class="text-center" style="margin-top: 10px;">
          <strong>Terceros:</strong> Esta plataforma no vende ni comparte datos de cookies con terceros con fines publicitarios. Si se activan servicios de analítica, los datos anonimizados podrán ser procesados por proveedores externos de analítica bajo sus respectivas políticas de privacidad.
        </h2>

        <h2 class="text-center">
          <strong>Gestión de preferencias:</strong> Puedes cambiar tus preferencias de cookies en cualquier momento haciendo clic en "Preferencias de Cookies" en el pie de página del sitio. También puedes gestionar las cookies desde la configuración de tu navegador — ten en cuenta que desactivar las cookies esenciales puede afectar el funcionamiento del sitio.
        </h2>

        <h2 class="text-center custom-center"><strong>8. CONTACTO</strong></h2>

        <h2 class="text-center">
          Para consultas sobre estos términos o políticas, puede escribir a <strong>hello@cinemagoria.com</strong>.
        </h2>

        <h2 class="title-secondary custom-center" style="font-size: 12px; margin-top:20px;"><strong>Última actualización:</strong> 6 de Abril del 2026</h2>
      </div>
    </section>
  </main>  
</template>
<script>
import UserNav from '@/components/global/UserNav';

export default {
  head () {
    return {
      title: 'Cinemagoria — Políticas de Uso y Acuerdo de Privacidad',
      meta: [
        { hid: 'description', name: 'description', content: 'Políticas de uso, términos de servicio y acuerdo de privacidad de Cinemagoria. Conoce cómo manejamos tus datos y qué cubren nuestros términos.' },
        { hid: 'og:title', property: 'og:title', content: 'Cinemagoria — Políticas de Uso y Acuerdo de Privacidad' },
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

  .cookie-table-wrapper {
    max-width: 800px;
    margin: 0 auto 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .cookie-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    line-height: 1.6;
  }

  .cookie-table th,
  .cookie-table td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    vertical-align: top;
  }

  .cookie-table th {
    color: #fafafa;
    font-weight: 700;
    white-space: nowrap;
  }

  .cookie-table td {
    color: #97999a;
  }

  .cookie-table td strong {
    color: #fafafa;
  }

  .cookie-table tbody tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
</style>
