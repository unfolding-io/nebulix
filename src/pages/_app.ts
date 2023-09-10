import type { App } from 'vue';
import Popper from "vue3-popper"; 
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';

export default (app: App) => { 
    app.component("Popper", Popper);
    app.use( Vue3Toasity,
  {
    autoClose: 3000,
    theme: 'colored',
    
  } as ToastContainerOptions)
  
}