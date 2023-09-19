$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  firebase.initializeApp(varConfig);

  navigator.serviceWorker.register('notificaciones-sw.js')
    .then(registro => {
      console.log('service worker registrado')
      firebase.messaging().useServiceWorker(registro)
    }).catch(error => {
      console.error(`Error al registrar el service worker => ${error}`)
    })

    const messaging = firebase.messaging()
    messaging.usePublicVapidKey('BORIS-VtYHQ2V50IVBffVMF18R01Insj0_ix_RVbwVvfNxmqYq_oUAM_EdjcikYj30laF7duHVSu89sHeg7k_-o')

    messaging.requestPermission().then(() => {
      console.log('permiso otorgado')
      return messaging.getToken()
    }).then(token => {
      console.log('token =>', token)
      const db = firebase.firestore()
      db.settings({ timestampsInSnapshots: true })
      db.collection('tokens').doc(token).set({
        token: token
      }).catch(error => {
        console.error(`Error al insertar el token en la BD => ${error}`)
      })
    }).catch(error => {
      console.error(`Error al otorgar el permiso => ${error}`)
    })


    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then(token => {
          console.log('token se ha renovado')
          const db = firebase.firestore()
          db.settings({ timestampsInSnapshots: true })
          db.collection('tokens').doc(token).set({
            token: token
          }).catch(error => {
            console.error(`Error al insertar el token en la BD => ${error}`)
          })
        })
    })

    messaging.onMessage(payload => {
      Materialize.toast(`Ya tenemos un nuevo post. Revisalo, se llama ${payload.data.titulo}`, 6000)
    })

  const post = new Post()
  post.consultarTodosPost()

  // TODO: Firebase observador del cambio de estado
  //$('#btnInicioSesion').text('Salir')
  //$('#avatar').attr('src', user.photoURL)
  //$('#avatar').attr('src', 'imagenes/usuario_auth.png')
  //$('#btnInicioSesion').text('Iniciar Sesión')
  //$('#avatar').attr('src', 'imagenes/usuario.png')

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    //$('#avatar').attr('src', 'imagenes/usuario.png')
    // Materialize.toast(`Error al realizar SignOut => ${error}`, 4000)
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    //$('#avatar').attr('src', 'imagenes/usuario.png')
    //Materialize.toast(`SignOut correcto`, 4000)
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')  
    const post = new Post()
    post.consultarTodosPost() 
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser

    if(user) {

      const post = new Post()
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts')

    } else {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)    
    }
  })
})
