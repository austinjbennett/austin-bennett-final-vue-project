import { createVuetify } from 'vuetify';
import 'vuetify/dist/vuetify.css';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});
