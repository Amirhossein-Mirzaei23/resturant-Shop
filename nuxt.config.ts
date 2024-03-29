// https://nuxt.com/docs/api/configuration/nuxt-config
// import bootstrap from 'bootstrap/dist/js/bootstrap.bundle',

export default defineNuxtConfig({
  devtools: { enabled: true },
  css:['~/assets/css/main.css','animate.css/animate.min.css','~/assets/css/tailwind.css'],
  plugins:[],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig:{
    public:{
      apiBase:'http://localhost:8000/api'
    }
  },
  modules:['@formkit/nuxt' ,'@pinia/nuxt' ,'@pinia-plugin-persistedstate/nuxt',],
  app:{
    head:{
      meta: [
        {content:"IE=edge","http-equiv":"X-UA-Compatible"},
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      link:[
        {rel:"stylesheet",href:"./assets/css/main.css"},
        {rel:"stylesheet",href:"toastr.css" }
      ],
      script:[
        {src:"toastr.js"}
      ],
      htmlAttrs:{
        dir:"rtl",
        lang:'fa'
      }
    }
  }
})
