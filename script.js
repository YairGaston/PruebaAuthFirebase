// Configuración de Firebase
// const firebaseConfig = {
//  apiKey: "TU_API_KEY",
//  authDomain: "TU_AUTH_DOMAIN",
//  projectId: "TU_PROJECT_ID",
//  storageBucket: "TU_STORAGE_BUCKET",
//  messagingSenderId: "TU_MESSAGING_SENDER_ID",
//  appId: "TU_APP_ID"
// };
  
  // Inicializar Firebase
  //const app = firebase.initializeApp(firebaseConfig);
  //const db = firebase.firestore(); 

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
  import { getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
  import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCctIitTMSq_Ku7RyMsem4x1Kzl_usg8W4",
    authDomain: "prueba-crud-25ed8.firebaseapp.com",
    projectId: "prueba-crud-25ed8",
    storageBucket: "prueba-crud-25ed8.firebasestorage.app",
    messagingSenderId: "682332718383",
    appId: "1:682332718383:web:7546aab7fdadf40d4a8dda"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app);

const googleLoginBtn = document.getElementById('googleLoginBtn');
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.querySelector('.container');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
    let unsubscribeII = null;

    // Manejar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario está logueado
    loginContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    userEmail.textContent = `Usuario: ${user.email}`;
    iniciarEscuchaCambios(); // Tu función para escuchar cambios en Firestore
  } else {
    // Usuario no está logueado
    loginContainer.style.display = 'block';
    mainContainer.style.display = 'none';
    userEmail.textContent = '';
    if (unsubscribeII) {
      unsubscribeII(); // Detener escucha de datos
    }
  }
});

// Manejar login con Google
googleLoginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
    mensaje.textContent = 'Sesión iniciada correctamente';
  } catch (error) {
    console.error('Error de autenticación:', error);
    mensaje.textContent = 'Error al iniciar sesión: ' + error.message;
  }
});

// Manejar logout
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    mensaje.textContent = 'Sesión cerrada correctamente';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    mensaje.textContent = 'Error al cerrar sesión';
  }
});



















  // Añade este código temporalmente para debug
async function verificarConexion() {
  try {
    const querySnapshot = await getDocs(collection(db, 'datosPersonales'));
    console.log('Documentos encontrados:', querySnapshot.size);
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}
verificarConexion();
  
  // Referencias al DOM
  const formulario = document.getElementById('formulario');
  const mensaje = document.getElementById('mensaje');
  const tablaRegistros = document.getElementById('tablaRegistros').getElementsByTagName('tbody')[0];
  
  let registroEditando = null; // Variable para almacenar el ID del registro que se está editando
  
  // Reemplazar función cargarRegistros
  let unsubscribe; // Variable para almacenar función de limpieza
  // Función para cargar los registros desde Firestore
  function iniciarEscuchaCambios() {
    // Limpiar listener anterior si existe
    if (unsubscribe) {
      unsubscribe();
    }
  
    unsubscribe = onSnapshot(collection(db, 'datosPersonales'), (snapshot) => {
      tablaRegistros.innerHTML = ''; // Limpiar tabla
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fila = document.createElement('tr');
  
        fila.innerHTML = `
          <td>${data.nombre}</td>
          <td>${data.email}</td>
          <td>${data.telefono}</td>
          <td>${data.direccion}</td>
          <td>${data.edad}</td>
          <td>
            <button class="editar" data-id="${doc.id}">Editar</button>
            <button class="eliminar" data-id="${doc.id}">Eliminar</button>
          </td>
        `;
        tablaRegistros.appendChild(fila);
      });
  
      // Agregar eventos a los botones
      document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', () => cargarRegistroParaEditar(btn.dataset.id));
      });
  
      document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', () => eliminarRegistro(btn.dataset.id));
      });
    }, (error) => {
      console.error('Error al escuchar cambios:', error);
      mensaje.textContent = 'Error al actualizar datos en tiempo real';
    });
  }
  
// Iniciar escucha de cambios al cargar la página
iniciarEscuchaCambios();
// Limpiar listener cuando se cierra la página
window.addEventListener('unload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});

  // Función para guardar o actualizar un registro
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const datosPersona = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      edad: document.getElementById('edad').value,
      fechaRegistro: serverTimestamp()
    };
  
    try {
      if (registroEditando) {
        // Actualizar registro existente
        const docRef = doc(db, 'datosPersonales', document.getElementById('idRegistro').value);
        await updateDoc(docRef, datosPersona);
        mensaje.textContent = 'Registro actualizado correctamente.';
      } else {
        // Crear nuevo registro
        await addDoc(collection(db, 'datosPersonales'), datosPersona);
        mensaje.textContent = 'Registro guardado correctamente.';
      }
  
      // Limpiar el formulario
      formulario.reset();
      document.getElementById('idRegistro').value = '';
      registroEditando = null;
  
      // Recargar los registros
      //await cargarRegistros();
    
  } catch (error) {
    console.error('Error:', error);
    mensaje.textContent = 'Error al guardar el registro';
  }
  });
  
  // Función para cargar un registro en el formulario para editar
  async function cargarRegistroParaEditar(id) {
    try {
      // Obtener referencia al documento
      const docRef = doc(db, 'datosPersonales', id);
      // Obtener el documento
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Cargar datos en el formulario
        document.getElementById('idRegistro').value = id;
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('email').value = data.email;
        document.getElementById('telefono').value = data.telefono;
        document.getElementById('direccion').value = data.direccion;
        document.getElementById('edad').value = data.edad;
  
        registroEditando = true;
        mensaje.textContent = 'Registro cargado para editar';
      } else {
        mensaje.textContent = 'No se encontró el registro';
      }
    } catch (error) {
      console.error('Error:', error);
      mensaje.textContent = 'Error al cargar el registro';
    }
  }
  
  // Función para eliminar un registro
  async function eliminarRegistro(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
  
    try {
      // Crear referencia al documento
      const docRef = doc(db, 'datosPersonales', id);
      // Eliminar el documento
      await deleteDoc(docRef);
      mensaje.textContent = 'Registro eliminado correctamente.';
      // Recargar la tabla
      await cargarRegistros();
    } catch (error) {
      console.error('Error al eliminar:', error);
      mensaje.textContent = 'Error al eliminar el registro';
    }
  }
  
  // Cargar los registros al iniciar la página
  //cargarRegistros();