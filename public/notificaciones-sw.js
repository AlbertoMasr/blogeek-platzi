importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')

firebase.inilializeApp({
    projectId: "blogeekplatzi-e520a",
    messagingSenderId: "358516936868"
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
    const tituloNotificacion = 'Ya tenemos un nuevo post'
    const opcionesNotificacion = {
        body: payload.data.titulo,
        icon: 'icons/icon_new_post.png',
        click_action: "https://blogeekplatzi-e520a.firebaseapp.com"
    }

    return self.registration.showNotification(tituloNotificacion, opcionesNotificacion)
})