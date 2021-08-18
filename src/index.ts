import App from "./components/app.svelte"


// init app
let app = new App({
    target:document.body
})

export default app;

if(import.meta.hot){
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
        app.$destroy();
    })
}