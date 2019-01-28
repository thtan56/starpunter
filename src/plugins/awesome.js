import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { faThumbsUp, faSpinner, faAmbulance, faHeadphones, faCircle,
  faTimes, faCertificate, faHeart, faStar, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab, faThumbsUp, faSpinner, faAmbulance, faHeadphones, faCircle,
  faTimes, faCertificate, faHeart, faStar, faCalendar, faUser,
  faFacebookF, faTwitter, faGoogle  ); // Include needed icons.
Vue.component('font-awesome-icon', FontAwesomeIcon); // Register component globally
Vue.component('font-awesome-layers', FontAwesomeLayers); 
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
