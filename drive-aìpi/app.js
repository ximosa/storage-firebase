// Firebase configuration
const firebaseConfig = {
tu configuracion firebase
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencias a los servicios de Firebase
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();

// Elementos del DOM
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const createFolderButton = document.getElementById('create-folder-button');
const folderGrid = document.getElementById('folder-grid');
const overlay = document.getElementById('overlay');
const folderNameElement = document.getElementById('folder-name');
const folderDescription = document.getElementById('folder-description');
const saveDescriptionButton = document.getElementById('save-description');
const fileList = document.getElementById('file-list');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const closeOverlayButton = document.getElementById('close-overlay');
const createFolderOverlay = document.getElementById('create-folder-overlay');
const folderDescriptionInput = document.getElementById('folder-description-input');
const folderTitleInput = document.getElementById('folder-title-input');
const confirmCreateFolderButton = document.getElementById('confirm-create-folder');
const cancelCreateFolderButton = document.getElementById('cancel-create-folder');

// Event listeners
loginButton.addEventListener('click', signInWithGoogle);
logoutButton.addEventListener('click', signOut);
closeOverlayButton.addEventListener('click', closeOverlay);
saveDescriptionButton.addEventListener('click', saveDescription);
uploadButton.addEventListener('click', uploadFiles);
createFolderButton.addEventListener('click', showCreateFolderOverlay);
confirmCreateFolderButton.addEventListener('click', createFolder);
cancelCreateFolderButton.addEventListener('click', hideCreateFolderOverlay);

// Iniciar sesión con Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}

// Cerrar sesión
function signOut() {
    auth.signOut();
}

// Listener de cambio de estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        loginButton.style.display = 'none';
        userInfo.style.display = 'flex';
        userAvatar.src = user.photoURL;
        userName.textContent = user.displayName;
        checkUserFolder(user);
document.getElementById('login-message').style.display = 'none';
    } else {
        loginButton.style.display = 'block';
        userInfo.style.display = 'none';
        createFolderButton.style.display = 'none';
document.getElementById('login-message').style.display = 'block';
    }
    loadFolders(); // Llamamos a loadFolders aquí para que se carguen las carpetas al iniciar sesión o al cambiar de usuario
});

// Verificar si el usuario ya tiene una carpeta
function checkUserFolder(user) {
    const folderRef = database.ref(`user-folders/${user.uid}`);
    folderRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) {
            createFolderButton.style.display = 'block';
        } else {
            createFolderButton.style.display = 'none';
        }
    });
}

// Mostrar el overlay de crear carpeta
function showCreateFolderOverlay() {
    createFolderOverlay.style.display = 'block';
}

// Ocultar el overlay de crear carpeta
function hideCreateFolderOverlay() {
    createFolderOverlay.style.display = 'none';
    folderDescriptionInput.value = '';
    folderTitleInput.value = '';
}

// Crear carpeta
function createFolder() {
    const user = auth.currentUser;
    if (user) {
        const folderRef = database.ref(`user-folders/${user.uid}`);
        folderRef.once('value').then((snapshot) => {
            if (snapshot.exists()) {
                alert("Ya tienes una carpeta creada.");
                hideCreateFolderOverlay();
                return;
            }
            
            const folderData = {
                name: user.displayName,
                title: folderTitleInput.value,
                description: folderDescriptionInput.value,
                photoURL: user.photoURL,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            // Crear una carpeta en Storage
            const storageRef = storage.ref(user.displayName);
            storageRef.put(new Blob([''], { type: 'text/plain' }), { customMetadata: { emptyFolder: 'true' } })
            .then(() => {
                // Si la carpeta se crea exitosamente en Storage, la guardamos en la base de datos
                return folderRef.set(folderData);
            })
            .then(() => {
                hideCreateFolderOverlay();
                createFolderButton.style.display = 'none';
                loadFolders(); // Volvemos a cargar las carpetas después de crear una nueva
            })
            .catch((error) => {
                console.error("Error al crear la carpeta:", error);
                alert("Hubo un error al crear la carpeta. Por favor, inténtalo de nuevo.");
            });
        });
    }
}


// Cargar todas las carpetas
function loadFolders() {
    folderGrid.innerHTML = ''; // Limpiamos el contenido anterior
    const foldersRef = database.ref('user-folders');
    foldersRef.once('value').then((snapshot) => {
        const addedFolders = new Set(); // Usamos un Set para evitar duplicados
        snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const folderData = childSnapshot.val();

            if (!addedFolders.has(folderData.name)) {
                addedFolders.add(folderData.name);

                const storageRef = storage.ref(folderData.name);
                storageRef.listAll().then(() => {
                    const folderElement = document.createElement('div');
                    folderElement.className = 'folder';
                    folderElement.innerHTML = `
                        <img src="${folderData.photoURL || 'https://example.com/default-avatar.png'}" alt="${folderData.name}'s avatar">
                        <p>${folderData.name}</p>
                        <h3>${folderData.title || 'Sin título'}</h3>
                    `;

                    // Aseguramos de que solo se agregue un event listener por cada carpeta
                    folderElement.removeEventListener('click', () => openFolder(folderData.name, folderData.name));
                    folderElement.addEventListener('click', () => openFolder(folderData.name, folderData.name));

                    folderGrid.appendChild(folderElement);
                }).catch(() => {
                    return database.ref(`user-folders/${userId}`).remove().then(() => null);
                });
            }
        });
    });
}

// ... (resto de tu código) ...

// Carga inicial (opcional, puedes eliminarla si ya estás llamando a loadFolders en otro lugar)
// loadFolders(); 


// Almacenar la referencia al event listener
const folderClickHandler = () => openFolder(folderData.name, folderData.name);

folderElement.addEventListener('click', folderClickHandler);

// ... antes de actualizar folderGrid con nuevas carpetas ...

// Eliminar el event listener usando la referencia almacenada
folderElement.removeEventListener('click', folderClickHandler);

// ... continuar con la actualización de folderGrid ...


// Abrir carpeta
function openFolder(folderName, userName) {
    overlay.style.display = 'block';
    folderNameElement.textContent = `Carpeta de ${userName}`;
    loadFolderContents(folderName);
    loadFolderDescription(folderName);
    
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.displayName === folderName) {
        folderDescription.contentEditable = 'true';
        saveDescriptionButton.style.display = 'block';
        document.getElementById('upload-container').style.display = 'block';
    } else {
        folderDescription.contentEditable = 'false';
        saveDescriptionButton.style.display = 'none';
        document.getElementById('upload-container').style.display = 'none';
    }
}

// Cargar contenido de la carpeta
function loadFolderContents(folderName) {
    fileList.innerHTML = '';
    const folderRef = storage.ref(folderName);
    folderRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
            itemRef.getMetadata().then((metadata) => {
                if (metadata.customMetadata && metadata.customMetadata.emptyFolder === 'true') {
                    return;
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${getFriendlyFileType(metadata.contentType)}</td>

                    <td>${metadata.name}</td>
                    <td><a href="#" onclick="downloadFile('${folderName}', '${metadata.name}')">Descargar</a></td>
                `;
                fileList.appendChild(row);
            });
        });
    });
}

// Descargar archivo
function downloadFile(folderName, fileName) {
    const fileRef = storage.ref(`${folderName}/${fileName}`);
    fileRef.getDownloadURL().then((url) => {
        window.open(url, '_blank');
    }).catch((error) => {
        console.error("Error al obtener la URL de descarga:", error);
        alert("Hubo un error al descargar el archivo. Por favor, inténtalo de nuevo.");
    });
}

// Obtener URL del icono del archivo basado en el tipo de contenido
function getFileIconUrl(contentType) {
    // Añade lógica para devolver la URL del icono apropiado basado en el tipo de contenido
    return 'https://example.com/file-icon.png';
}

// Cargar descripción de la carpeta
function loadFolderDescription(folderName) {
    const foldersRef = database.ref('user-folders');
    foldersRef.orderByChild('name').equalTo(folderName).once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const folderData = childSnapshot.val();
            folderDescription.textContent = folderData.description || 'No hay descripción disponible.';
        });
    });
}

// Guardar descripción de la carpeta
function saveDescription() {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const foldersRef = database.ref('user-folders');
        foldersRef.orderByChild('name').equalTo(currentUser.displayName).once('value').then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                childSnapshot.ref.update({ description: folderDescription.textContent });
            });
        });
    }
}

// Subir archivos
function uploadFiles() {
    const currentUser = auth.currentUser;
    if (currentUser && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach((file) => {
            const fileRef = storage.ref(`${currentUser.displayName}/${file.name}`);
            fileRef.put(file).then(() => {
                loadFolderContents(currentUser.displayName);
            }).catch((error) => {
                console.error("Error al subir el archivo:", error);
                alert("Hubo un error al subir el archivo. Por favor, inténtalo de nuevo.");
            });
        });
    }
}

// Cerrar overlay
function closeOverlay() {
    overlay.style.display = 'none';
}
function getFriendlyFileType(contentType) {
  const typeMap = {
    'image/jpeg': 'Archivo de imagen',
    'image/png': 'Archivo de imagen',
    'text/html': 'Archivo HTML',
    'text/js': 'Archivo js',
     'text/css': 'Archivo css',
'text/javascript': 'Archivo JavaScript', 
    'application/javascript': 'Archivo JavaScript',
    'application/zip': 'Archivo ZIP',
    // Agrega más tipos MIME y descripciones según sea necesario
  };

  return typeMap[contentType] || 'Archivo desconocido';
}
// Carga inicial
loadFolders();
