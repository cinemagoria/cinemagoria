export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.vueApp.directive('lazyload', {
        mounted(el, binding) {
            if (binding.value) {
                el.src = binding.value
            }
        },
        updated(el, binding) {
            if (binding.value !== binding.oldValue) {
                el.src = binding.value
            }
        },
        getSSRProps(binding, vnode) {
            return binding.value ? { src: binding.value } : {}
        }
    })
})
