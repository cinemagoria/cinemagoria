<template>
  <main class="main">
    <section class="terms-section">
      <div class="user-profile">
        <div class="language-selector" style="position: relative; top: 43px;"> 
          <div class="selected-language"  @click="toggleLanguageMenu" >
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-right: 4px; width: 13px; height: 13px; margin-right: 4px;">
            <span class="language">En</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'english'" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1" @click="changeLanguage('spanish')">
              <span>Español</span>
            </label>
          </div>
        </div>
      </div>  
      <br>
      <h1 class="text-white text-center"><b>User Agreement / Terms and Conditions / Cookies Policy.</b></h1>
      <br>
      <div>
        <h2 class="text-center custom-center"><strong>FOR ONLINE REFERENCE ONLY. EACH ACCESS IS BY PERMISSION ONLY.</strong></h2>
        <h2 class="text-center custom-center"><strong>1. USE OF THE WEBSITE</strong></h2>
        <h2 class="text-center">THIS DEMONSTRATIVE TECHNICAL WEBSITE, PROVIDED WITHOUT ANY WARRANTY, IS INTENDED SOLELY FOR IMMEDIATE PERSONAL ONLINE VIEWING, FOR NON-COMMERCIAL AND NONPROFIT PURPOSES. PLEASE READ THIS ENTIRE AGREEMENT BEFORE USING THIS WEBSITE. BY ACCESSING OR USING THIS WEBSITE, INCLUDING ITS DOMAIN NAME(S) OR IP ADDRESSES, CONTENT, OR ANY INTERACTION (SUCH AS CLICKING ON LINKS), YOU ACKNOWLEDGE AND DECLARE THAT YOU ACCEPT THIS USER AGREEMENT. YOUR ACCESS AND USE INDICATE YOUR ACKNOWLEDGMENT, ACCEPTANCE, AND UNCONDITIONAL AGREEMENT TO ALL THE TERMS AND CONDITIONS SET FORTH HEREIN WITHOUT MODIFICATION, AND THIS AGREEMENT TAKES EFFECT IMMEDIATELY. TO REJECT, SIMPLY REFRAIN FROM USING THE WEBSITE AND CLOSE ALL ITS WINDOWS. HOWEVER, YOU MAY NOT ACCESS OR USE THIS WEBSITE IF YOU (OR YOUR GUARDIAN OR LEGAL REPRESENTATIVE) CANNOT ENTER INTO A BINDING CONTRACT OR IN ANY JURISDICTION WHERE THIS USER AGREEMENT IS NOT ENFORCEABLE. YOU AGREE THAT YOUR USE CONSTITUTES ACKNOWLEDGMENT THAT YOU HAVE READ, UNDERSTOOD, AND ACCEPTED ALL TERMS. IF YOU ARE THE OWNER OR OPERATOR OF THE EQUIPMENT USED TO ACCESS THIS WEBSITE, BY ALLOWING SUCH USE, YOU CONSENT AND AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS USER AGREEMENT. IF ACTING ON BEHALF OF ORGANIZATIONS, YOU DECLARE THAT YOU ARE AUTHORIZED TO ACT AS AN AGENT AND ACCEPT THIS USER AGREEMENT ON BEHALF OF YOUR EMPLOYER AND ORGANIZATIONS. YOU AGREE TO USE THE WEBSITE ONLY IN ACCORDANCE WITH THESE USAGE RIGHTS AND ALL APPLICABLE LAWS AND REGULATIONS. YOU MAY NOT: -ATTEMPT TO BYPASS THE WEBSITE'S SECURITY MEASURES. -USE THE WEBSITE IN A WAY THAT MAY HARM IT OR AFFECT ITS PERFORMANCE. -DISASSEMBLE OR DECOMPILE THE WEBSITE.</h2>
        <h2 class="text-center custom-center"><strong>2. CREDITS - THIS PROJECT IS AN IMPLEMENTATION</strong></h2>
        <h2 class="text-center">This project represents an implementation derived from the project initiated by 'TASTEJS': 
        <strong><a href="https://github.com/tastejs/nuxt-movies" target="_blank">'NUXT MOVIES'</a></strong></h2>
        <h2 class="text-center custom-center"><strong>3. DISCLAIMER FOR WEBSITE USE</strong></h2>
        <h2 class="text-center">THE WEBSITE IS PROVIDED "AS IS" AND "AS AVAILABLE." CINEMATHE MAKES NO WARRANTIES, EXPRESS OR IMPLIED, ABOUT THE FUNCTIONALITY, ACCURACY, OR AVAILABILITY OF THE WEBSITE. ADDITIONALLY, IN THE EVENT OF ANY CYBER ATTACK, SECURITY VULNERABILITY, OR UNAUTHORIZED ACCESS TO THE WEBSITE, CINEMATHE WILL NOT BE RESPONSIBLE FOR DAMAGES, LOSSES, OR DISRUPTIONS CAUSED BY IT. USERS ACKNOWLEDGE AND ACCEPT THAT THE SECURITY OF THE WEBSITE MAY BE COMPROMISED, AND THEY USE THE WEBSITE AT THEIR OWN RISK IN SUCH CIRCUMSTANCES. WE TAKE EXTENSIVE AND CONTINUOUS MEASURES TO ENSURE THE SECURITY OF THE WEBSITE, BUT WE DO NOT GUARANTEE ABSOLUTE SECURITY. THE ONLINE SECURITY LANDSCAPE IS CHALLENGING, AND NO SYSTEM CAN CLAIM COMPLETE IMMUNITY AGAINST RISKS. PLEASE BE AWARE THAT OUR PRIMARY GOAL IS TO SAFEGUARD THE INTEGRITY OF THE WEB APPLICATION AND YOUR EXPERIENCE WITH IT. WE ARE COMMITTED TO ENSURING A SECURE ENVIRONMENT FOR YOUR USE. IT IS ESSENTIAL FOR USERS TO TAKE PRECAUTIONS, SUCH AS VERIFYING THE LINKS THEY USE AND USING UPDATED AND SECURE DEVICES AND NETWORKS. IN THE UNLIKELY EVENT OF ANY SECURITY INCIDENT, WE WILL INVESTIGATE IMMEDIATELY, TAKE NECESSARY ACTIONS, AND KEEP YOU INFORMED. THIS DISCLAIMER EXTENDS TO ANY POTENTIAL IMPACT ON USER DATA, SYSTEM INTEGRITY, OR THE OVERALL PERFORMANCE OF THE WEBSITE RESULTING FROM EXTERNAL MALICIOUS ACTIVITIES. USERS ARE ADVISED TO USE THE WEBSITE WITH AWARENESS OF POSSIBLE SECURITY RISKS AND TAKE NECESSARY MEASURES TO PROTECT THEIR DATA AND DEVICES. </h2>
        <h2 class="text-center custom-center"><strong>4. RESPONSIBLE USE OF CINEMATHE AND BEST PRACTICES. IMPORTANT NOTICE:</strong></h2>
        <h2 class="text-center">BY USING Cinemathe, THE USER ACKNOWLEDGES AND AGREES THAT THE FUNCTIONALITY OF THIS WEBSITE IS DESIGNED EXCLUSIVELY FOR NON-COMMERCIAL OR PROFIT PURPOSES, FOR PRESENTATION TO RECRUITERS. THE CINEMATHE PROJECT IS NOT CERTIFIED OR ENDORSED BY TMDB. AS IT IS DEMONSTRATIVE AND FOR LEARNING PURPOSES BASED ON DATA PROVIDED BY THE TMDB API FOR DEVELOPERS. Cinemathe, ITS DEVELOPMENT TEAM, AND ANY RELATED ENTITY ASSUME NO RESPONSIBILITY FOR THE MISUSE OF THE TMDB API OR ANY OTHER ASPECT OF THE SITE'S FUNCTIONALITY. THE RESPONSIBILITY RESTS SOLELY WITH THE USER, WHO MUST USE THE PLATFORM RESPONSIBLY AND ADHERE TO BEST ONLINE PRACTICES WHEN USING DATA OBTAINED FROM THE TMDB API. IT IS CRUCIAL TO ACKNOWLEDGE THAT ANY MISUSE OF THE FUNCTIONALITY IS BEYOND OUR PURPOSE. PLEASE CONSIDER THE FOLLOWING BEST PRACTICES: AVOID USING THIS WEB APPLICATION FOR ILLEGAL OR MALICIOUS ACTIVITIES. DO NOT USE CINEMATHE IN CRITICAL ENVIRONMENTS OR WITH EXPECTATIONS OF ACTIVE OPERATION. YOUR UNDERSTANDING AND COMPLIANCE WITH THESE GUIDELINES ARE CRUCIAL FOR THE RESPONSIBLE USE OF Cinemathe. WE APPRECIATE YOUR COOPERATION AND HOPE YOU ENJOY THE DEMONSTRATIVE EXPERIENCE OF OUR SERVICE.</h2>
        <h2 class="text-center custom-center"><strong>5. ATTRIBUTIONS:</strong></h2>
        <h2 class="text-center">
            Social media icons and SVGs are licensed under the Creative Commons Attribution 4.0 International License. Attribution: Font Awesome Free 5.2.0 by @FontAwesome. Learn more at <a href="https://fontawesome.com" target="_blank">Font Awesome</a>, CC BY 4.0 via Wikimedia Commons.
            Data regarding movies and TV shows is provided by <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>.
            Data regarding streaming providers, networks, and platforms is provided by <a href="https://www.justwatch.com" target="_blank">JustWatch</a>.
        </h2>
        <h2 class="text-center custom-center"><strong>6. INFORMATION WE COLLECT</strong></h2>
        <h2 class="text-center">CINEMATHE MAY COLLECT AND STORE CERTAIN INFORMATION ABOUT YOUR USE OF THE WEBSITE. THIS INCLUDES NON-PERSONAL INFORMATION SUCH AS DEVICE TYPE, BROWSER TYPE, AND USAGE PATTERNS. OUR PRIVACY POLICY (SEE SECTION 9) PROVIDES FURTHER DETAILS ON HOW WE HANDLE THIS INFORMATION.</h2>
        <h2 class="text-center custom-center"><strong>7. MODIFICATIONS AND TERMINATION</strong></h2>
        <h2 class="text-center">CINEMATHE RESERVES THE RIGHT TO MODIFY, SUSPEND, OR TERMINATE THE WEBSITE AT ANY TIME WITHOUT PRIOR NOTICE.</h2>
        <h2 class="text-center custom-center"><strong>8. LIMITATION OF LIABILITY</strong></h2>
        <h2 class="text-center">CINEMATHE WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM THE USE OR INABILITY TO USE THE WEBSITE.</h2>
        <h2 class="text-center custom-center"><strong>9. PRIVACY POLICY</strong></h2>
        <h2 class="text-center">BY USING OUR WEBSITE, YOU AGREE TO THE USE OF COOKIES. OUR COOKIE POLICY PROVIDES DETAILS ON WHAT COOKIES ARE, HOW WE USE THEM, THE INVOLVEMENT OF THIRD-PARTY PARTNERS, YOUR COOKIE OPTIONS, AND ADDITIONAL INFORMATION. COOKIES ARE SMALL PIECES OF TEXT SENT TO YOUR WEB BROWSER FROM A VISITED WEBSITE. THEY ARE STORED IN YOUR BROWSER, ALLOWING THE WEBSITE OR THIRD PARTIES TO RECOGNIZE YOU, SIMPLIFYING YOUR SUBSEQUENT VISITS AND IMPROVING THE WEBSITE'S UTILITY. DURING YOUR USE OF THE WEBSITE, WE MAY PLACE VARIOUS COOKIE FILES IN YOUR WEB BROWSER, SERVING ESSENTIAL AND ANALYTICAL PURPOSES. IN ADDITION TO OURS, WE MAY USE THIRD-PARTY COOKIES TO REPORT WEBSITE USAGE STATISTICS, DELIVER ADS, ETC. IF YOU WISH TO DELETE OR REJECT COOKIES, PLEASE REFER TO YOUR BROWSER'S HELP PAGES. NOTE THAT SUCH ACTIONS MAY LIMIT FEATURES, PREFERENCE STORAGE, AND PAGE DISPLAY. FOR POPULAR BROWSERS LIKE GOOGLE CHROME, OPERA, MOZILLA FIREFOX, AND SAFARI, YOU CAN FIND SPECIFIC INSTRUCTIONS ON THEIR RESPECTIVE SUPPORT PAGES. EXPLORE ALLABOUTCOOKIES.ORG AND NETWORKADVERTISING.ORG FOR COMPREHENSIVE INSIGHTS.FURTHERMORE, IN THE CONTEXT OF OUR API SERVICE, DATA OBTAINED BELONGS TO PUBLIC TMDB API.</h2>
        <h2 class="text-center custom-center"><strong>10. CONTACT</strong></h2>
        <h2 class="text-center">FOR ANY INQUIRIES OR CONCERNS REGARDING THIS USER AGREEMENT, TERMS AND CONDITIONS, OR PRIVACY POLICIES, PLEASE EMAIL US AT <strong>CONTACT@IVANLUNA.DEV.</strong></h2>
      </div>
      <br>
      <div class="button-container">
        <button class="button button--icon" @click="redirectToHome">
          <!-- eslint-disable-next-line -->
          <span class="txt">Back</span>
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
      selectedLanguage: 'english',
    };
  },
  methods: {
    redirectToHome() {
      window.location.href = 'https://cinemathe.space';
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
      const spanishUrl = `${currentOrigin.replace(
        '://',
        '://es.'
      )}${currentPath}`;
      window.location.href = spanishUrl;
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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
