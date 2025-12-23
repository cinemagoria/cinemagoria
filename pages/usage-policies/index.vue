
<template>
  <main class="main">
    <section class="terms-section">
      <UserNav @show-rated-modal="showRatedItems" />
      <br>
      <h1 class="title-primary text-center" style="font-size: 20px; margin-top: 10px;"><b>Usage Policies & Privacy Agreement</b></h1>
      <br>
      <div>
        <h2 class="title-secondary custom-center" style="font-size: 12px;"><strong>Effective Date:</strong> March 27, 2024</h2>
        <h2 class="text-center custom-center"><strong>1. INTRODUCTION</strong></h2>
        <h2 class="text-center">THIS DEMONSTRATIVE TECHNICAL PLATFORM, PROVIDED WITHOUT ANY WARRANTY, IS INTENDED SOLELY FOR IMMEDIATE PERSONAL ONLINE VIEWING, FOR NON-COMMERCIAL AND NONPROFIT PURPOSES. PLEASE READ THIS ENTIRE AGREEMENT BEFORE USING THIS PLATFORM. BY ACCESSING OR USING THIS PLATFORM, INCLUDING ITS DOMAIN NAME(S), CONTENT, OR ANY INTERACTION (SUCH AS CLICKING ON LINKS), YOU ACKNOWLEDGE AND DECLARE THAT YOU ACCEPT THIS USER AGREEMENT AND THAT YOU ARE 18 YEARS OF AGE OR OLDER. YOUR ACCESS AND USE INDICATE YOUR ACKNOWLEDGMENT, ACCEPTANCE, AND UNCONDITIONAL AGREEMENT TO ALL THE TERMS AND CONDITIONS SET FORTH HEREIN WITHOUT MODIFICATION, AND THIS AGREEMENT TAKES EFFECT IMMEDIATELY.</h2>
        <h2 class="text-center">To reject these terms, simply refrain from using the platform and close all its windows. You may not access or use this platform if you (or your legal guardian) cannot enter into a binding contract, or in any jurisdiction where this agreement is not enforceable. By allowing access to this platform through your device or network, you consent and agree to be bound by these Usage Policies.</h2>
        <h2 class="text-center">You agree to use the platform only in accordance with applicable laws and the rights herein granted. You may not: -ATTEMPT TO BYPASS OR INTERFERE WITH THE PLATFORM'S SECURITY MEASURES. -USE THE PLATFORM IN A MANNER THAT MAY HARM OR IMPAIR ITS PERFORMANCE. -DISASSEMBLE, REVERSE ENGINEER, OR DECOMPILE ANY PART OF THE PLATFORM.</h2>
        <h2 class="text-center custom-center"><strong>2. DISCLAIMER FOR USE</strong></h2>
        <h2 class="text-center">EnterCinema aggregates publicly available entertainment data to deliver search results, recommendations, and metadata for movies and TV shows. While every effort is made to ensure data accuracy and relevance, the information displayed may occasionally contain inaccuracies, incomplete metadata, or media descriptions of a mature nature.</h2>
        <h2 class="text-center">This platform features <strong>Google Gemini AI</strong> through its official API. AI-generated responses may contain factual or contextual inaccuracies. EnterCinema provides these AI-based outputs "as is" and without any guarantee of precision or completeness.</h2>
        <h2 class="text-center">Users are solely responsible for interpreting and acting upon AI responses, metadata, or third-party information. <strong>IN NO EVENT SHALL EnterCinema, ITS CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM, ITS AI FEATURES, OR ANY ANALYTICS DATA PROCESSED THROUGH IT.</strong></h2>
        <h2 class="text-center custom-center"><strong>3. EXTERNAL LINKS & THIRD-PARTY CONTENT</strong></h2>
        <h2 class="text-center">Certain sections of this platform may include automatically generated external references to third-party domains and applications where audiovisual content or related metadata may be available. Such links are generated programmatically through open APIs or standard URI protocols based on publicly available identifiers (for example, IMDb IDs) and are provided <strong>solely for informational and indexing purposes</strong>.</h2>
        <h2 class="text-center">EnterCinema does not host, store, stream, or reproduce any audiovisual works. The platform functions exclusively as a <strong>non-profit indexer of publicly accessible information</strong>. External URLs and protocol links (such as those that may open external media applications) are displayed automatically as part of metadata retrieved from public sources, without manual curation or selection.</h2>
        <h2 class="text-center">Accessing any external domain, streaming hub, or third-party media service through links displayed on EnterCinema is entirely optional and performed at the user's sole discretion. EnterCinema has no technical or editorial control over the legality, content, or functionality of those destinations, and <strong>DOES NOT PROMOTE, ENCOURAGE, OR ENDORSE ANY FORM OF COPYRIGHT INFRINGEMENT OR UNAUTHORIZED DISTRIBUTION OF PROTECTED WORKS</strong>.</h2>
        <h2 class="text-center">Any viewing, streaming, or downloading activity that occurs after following an external link is governed exclusively by the respective third party's terms of service, privacy policy, and applicable local laws. EnterCinema and its contributors assume no responsibility or liability for the nature, accuracy, or lawfulness of third-party content or for any consequences arising from the user's access to it.</h2>
        <h2 class="text-center">These external references are included <strong>in good faith</strong> to enrich the user's browsing experience by connecting them with legitimate metadata and contextual information sources. The platform's intent is to <strong>facilitate discovery, not distribution</strong>.</h2>
        <h2 class="text-center custom-center"><strong>4. PRIVACY POLICY</strong></h2>
        <h2 class="text-center">EnterCinema does not sell or share user data for any commercial purpose. Any personal information voluntarily provided (e.g., during registration or authentication) is used exclusively to deliver personalized functionality such as watchlists, preferences, and account synchronization.</h2>
        <h2 class="text-center">Authentication is handled through <strong>Google OAuth</strong> and native registration systems. No sensitive personal data is shared with external parties. AI interactions are processed via the <strong>Google Gemini API</strong> and are subject to <a href="https://ai.google.dev/gemini-api/terms" target="_blank">Gemini API Terms</a> and <a href="https://ai.google.dev/gemini-api/docs/usage-policies" target="_blank">Usage Policies</a>.</h2>
        <h2 class="text-center">While EnterCinema may log anonymous analytical data to improve usability, it never profiles or identifies individual users.</h2>
        <h2 class="text-center custom-center"><strong>5. DATA SOURCES & ATTRIBUTIONS</strong></h2>
        <h2 class="text-center">The platform integrates data from multiple public APIs and metadata providers. All trademarks, logos, and assets remain the property of their respective owners. Data is displayed under fair use and non-commercial terms.</h2>
        <h2 class="text-center">Icons and SVGs are licensed under Creative Commons Attribution 4.0 International License. Attribution: Font Awesome Free 5.2.0 by @FontAwesome. Learn more at <a href="https://fontawesome.com" target="_blank">Font Awesome</a>, CC BY 4.0 via Wikimedia Commons. Movie and TV show data is provided by <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>. Streaming provider, network, and platform data is provided by <a href="https://www.justwatch.com" target="_blank">JustWatch</a>. Additional data is provided by <a href="https://mdblist.com" target="_blank">MDBList</a>. Reviews of films and series are complemented by <a href="https://trakt.tv" target="_blank">Trakt</a> .</h2>
        <h2 class="text-center custom-center"><strong>6. GENERAL CONDITIONS</strong></h2>
        <h2 class="text-center">EnterCinema is an ongoing non-profit demonstration project and reserves the right to update or modify these Usage Policies without prior notice. Continued use of the platform signifies acceptance of the most current version.</h2>
        <h2 class="text-center custom-center"><strong>7. COOKIE USAGE</strong></h2>
        <h2 class="text-center">BY USING OUR WEBSITE, YOU CONSENT TO THE USE OF COOKIES. OUR COOKIE POLICY PROVIDES DETAILS ON WHAT COOKIES ARE, HOW WE USE THEM, THIRD-PARTY INVOLVEMENT, YOUR COOKIE CHOICES, AND ADDITIONAL INFORMATION. COOKIES ARE SMALL TEXT FILES SENT TO YOUR WEB BROWSER FROM A VISITED WEBSITE. THEY ARE STORED IN YOUR BROWSER, ALLOWING THE WEBSITE OR THIRD PARTIES TO RECOGNIZE YOU, SIMPLIFYING SUBSEQUENT VISITS AND ENHANCING WEBSITE UTILITY. DURING YOUR USE OF THE WEBSITE, WE MAY PLACE VARIOUS COOKIE FILES IN YOUR WEB BROWSER, SERVING ESSENTIAL AND ANALYTICAL PURPOSES. IN ADDITION TO OURS, WE MAY USE THIRD-PARTY COOKIES TO REPORT WEBSITE USAGE STATISTICS, DELIVER ADVERTISEMENTS, ETC. IF YOU WISH TO DELETE OR REJECT COOKIES, CONSULT YOUR BROWSER'S HELP PAGES. PLEASE NOTE THAT SUCH ACTIONS MAY LIMIT FEATURES, PREFERENCE STORAGE, AND PAGE VIEWING. FOR POPULAR BROWSERS SUCH AS GOOGLE CHROME, OPERA, MOZILLA FIREFOX, AND SAFARI, YOU CAN FIND SPECIFIC INSTRUCTIONS ON THEIR RESPECTIVE SUPPORT PAGES. EXPLORE <a href="https://allaboutcookies.org" target="_blank">ALLABOUTCOOKIES.ORG</a> AND <a href="https://networkadvertising.org" target="_blank">NETWORKADVERTISING.ORG</a> FOR COMPREHENSIVE INFORMATION.</h2>
        <h2 class="text-center custom-center"><strong>8. CONTACT</strong></h2>
        <h2 class="text-center">FOR ANY INQUIRIES OR CONCERNS REGARDING THIS USER AGREEMENT, TERMS AND CONDITIONS, OR PRIVACY POLICIES, PLEASE EMAIL <strong>hello@entercinema.com.</strong></h2>
        <h2 class="title-secondary custom-center" style="font-size: 12px; margin-top:20px;"><strong>Last Updated:</strong> December 20, 2025</h2>
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
</style>
