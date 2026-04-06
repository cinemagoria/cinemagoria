
<template>
  <main class="main">
    <section class="terms-section">
      <UserNav @show-rated-modal="showRatedItems" />
      <br>
      <h1 class="title-primary text-center" style="font-size: 20px; margin-top: 10px;"><b>Usage Policies & Privacy Agreement</b></h1>
      <br>
      <div>
          <h2 class="title-secondary custom-center" style="font-size: 12px; position:relative; bottom:15px;"><strong>Effective date:</strong> March 27, 2024</h2>

          <h2 class="text-center custom-center"><strong>1. INTRODUCTION</strong></h2>

          <h2 class="text-center">
            THIS DEMONSTRATIVE TECHNICAL PLATFORM IS PROVIDED WITHOUT WARRANTIES OF ANY KIND AND IS INTENDED SOLELY FOR PERSONAL, NON-COMMERCIAL USE. PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING THE PLATFORM. BY ACCESSING OR USING THIS SITE —INCLUDING ITS DOMAIN, CONTENT, OR ANY INTERACTION— YOU ACKNOWLEDGE THAT YOU ACCEPT THIS USER AGREEMENT AND THAT YOU ARE AT LEAST 18 YEARS OF AGE. USE OF THE PLATFORM CONSTITUTES FULL AND UNRESERVED ACCEPTANCE OF THESE TERMS AND CONDITIONS, WHICH TAKE EFFECT IMMEDIATELY.
          </h2>

          <h2 class="text-center">
            Users agree to use the platform in accordance with applicable laws and these terms. The following is prohibited: attempting to breach or interfere with security systems; using the platform in a way that may impair its performance; disassembling, decompiling, or reverse engineering any part of the platform.
          </h2>

          <h2 class="text-center">
            If you do not agree with these terms, you must refrain from using the platform and close all related windows.
          </h2>

          <h2 class="text-center custom-center"><strong>2. DISCLAIMER OF USE</strong></h2>

          <h2 class="text-center">
            Cinemagoria collects and presents publicly available entertainment information in order to provide search results, recommendations, and metadata for films and series. While accuracy and relevance are prioritized, errors, omissions, or references to sensitive or mature content may occur.
          </h2>

          <h2 class="text-center">
            The use and interpretation of any results, metadata, or third-party information is the sole responsibility of the user. <strong>IN NO EVENT SHALL Cinemagoria, ITS CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM THE USE OF THE PLATFORM OR ANY DATA PROCESSED THROUGH IT.</strong>
          </h2>

          <h2 class="text-center custom-center"><strong>3. EXTERNAL LINKS AND THIRD-PARTY CONTENT</strong></h2>

          <h2 class="text-center">
            Certain sections may include automatically generated links to third-party domains or applications where audiovisual content or related metadata may be available. These links are generated programmatically through public APIs or standard protocols, based on public identifiers (such as IMDb ID, TMDB ID, etc.), and are provided <strong>strictly for informational and indexing purposes</strong>.
          </h2>

          <h2 class="text-center">
            Cinemagoria does not host, store, transmit, or reproduce audiovisual content. The platform operates solely as a <strong>non-profit indexer of publicly available information</strong>. External URLs and protocol links are displayed automatically as part of metadata obtained from public sources, without editorial intervention.
          </h2>

          <h2 class="text-center">
            Access to external services or platforms is optional and at the user’s sole discretion. Cinemagoria does not control the legality, content, or operation of such services and <strong>DOES NOT PROMOTE OR SUPPORT COPYRIGHT INFRINGEMENT OR UNAUTHORIZED DISTRIBUTION OF PROTECTED CONTENT</strong>.
          </h2>

          <h2 class="text-center">
            Any actions taken on third-party sites are governed by their respective terms and policies. Cinemagoria assumes no responsibility for external content or for any consequences arising from access to such sites.
          </h2>

          <h2 class="text-center">
            These references are provided <strong>in good faith</strong> to enhance the user experience. The platform is designed for discovery, not distribution.
          </h2>

          <h2 class="text-center custom-center"><strong>4. PRIVACY POLICY</strong></h2>

          <h2 class="text-center">
            Cinemagoria does not sell or share personal data for commercial purposes. Information provided voluntarily is used exclusively for features such as lists, preferences, and account synchronization.
          </h2>

          <h2 class="text-center">
            Authentication is handled through <strong>Google OAuth</strong> and internal systems. No sensitive data is shared with third parties.
          </h2>

          <h2 class="text-center">
            Anonymous analytical data may be collected to improve the service.
          </h2>

          <h2 class="text-center custom-center"><strong>5. DATA SOURCES AND ATTRIBUTIONS</strong></h2>

          <h2 class="text-center">
            The platform integrates data from public APIs and metadata providers. All trademarks and assets belong to their respective owners. Information is presented under fair use principles and for non-commercial purposes. Rights holders or publishers who wish to request content removal (<em>opt-out</em>) may contact us as indicated in <strong>Section 8</strong>.
          </h2>

          <h2 class="text-center">
            <strong>Festival Data Coverage:</strong> Cinemagoria collects festival lineups from public sources. Data availability may be incomplete, particularly for short films or works with limited presence in public sources. As a result, the number of titles displayed for a given festival may differ from its official program. These differences reflect technical limitations of external data sources and not editorial decisions.
          </h2>

          <h2 class="text-center">
            <strong>News Aggregation:</strong> Content is sourced from public RSS feeds for indexing purposes. Cinemagoria does not modify source material and only displays the information provided (such as titles, descriptions, and metadata). Full articles cannot be read within the platform; all interactions redirect to the original publisher, ensuring that traffic, impressions, and monetization remain with the source. Additionally, the platform may publish its own editorial content generated or assisted through automated processes, which is provided for informational purposes and may contain errors, omissions, or inaccuracies. Images are displayed solely for identification under fair use principles.
          </h2>

          <h2 class="text-center">
            Icons and visual assets are licensed under Creative Commons Attribution 4.0. Data provided by TMDB, JustWatch, MDBList, and Trakt.
          </h2>

          <h2 class="text-center custom-center"><strong>6. GENERAL CONDITIONS</strong></h2>

          <h2 class="text-center">
            Cinemagoria is an ongoing project under continuous development and reserves the right to modify these terms at any time. Continued use implies acceptance of the current version.
          </h2>

          <h2 id="cookies" class="text-center custom-center"><strong>7. COOKIE POLICY</strong></h2>

          <h2 class="text-center">
            This platform uses cookies and similar client-side storage technologies. You can manage your preferences at any time using the cookie settings available in the site footer or the consent banner shown on your first visit.
          </h2>

          <div class="cookie-table-wrapper">
            <table class="cookie-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Purpose</th>
                  <th>Examples</th>
                  <th>Duration</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Essential</strong></td>
                  <td>Authentication, session management, security, and core site functionality</td>
                  <td>Login tokens, CSRF protection, consent preferences</td>
                  <td>Session – 1 year</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td><strong>Analytics</strong></td>
                  <td>Usage statistics to understand how the platform is used and identify areas for improvement</td>
                  <td>Page views, navigation patterns, feature usage</td>
                  <td>Up to 2 years</td>
                  <td>No — opt-in</td>
                </tr>
                <tr>
                  <td><strong>Personalization</strong></td>
                  <td>Remembers browsing context for a tailored experience</td>
                  <td>Recently visited sections</td>
                  <td>Up to 1 year</td>
                  <td>No — opt-in</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-center" style="margin-top: 10px;">
            <strong>Third parties:</strong> This platform does not sell or share cookie data with third parties for advertising purposes. If analytics services are enabled, anonymized data may be processed by third-party analytics providers under their respective privacy policies.
          </h2>

          <h2 class="text-center">
            <strong>Managing your choices:</strong> You can change your cookie preferences at any time by clicking "Cookie Preferences" in the site footer. You may also manage cookies through your browser settings — note that disabling essential cookies may affect site functionality.
          </h2>

          <h2 class="text-center custom-center"><strong>8. CONTACT</strong></h2>

          <h2 class="text-center">
            For inquiries regarding these terms or policies, please contact <strong>hello@cinemagoria.com</strong>.
          </h2>

          <h2 class="title-secondary custom-center" style="font-size: 12px; margin-top:20px;"><strong>Last updated:</strong> April 6, 2026</h2>
      </div>
      <br>
    </section>
  </main>  
</template>
<script>
import UserNav from '@/components/global/UserNav';

export default {
  head () {
    return {
      title: 'Cinemagoria — Usage Policies & Privacy Agreement',
      meta: [
        { hid: 'description', name: 'description', content: 'Cinemagoria usage policies, terms of service, and privacy agreement. Learn how we handle your data and what our platform terms cover.' },
        { hid: 'og:title', property: 'og:title', content: 'Cinemagoria — Usage Policies & Privacy Agreement' },
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
