// 🔥 Substitua pelas suas credenciais do Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Tema
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
body.className = savedTheme;
themeToggle.textContent = savedTheme === 'dark-theme' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark-theme' : 'light-theme');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
});

// Modais
const loginModal = document.getElementById('loginModal');
const cadastroModal = document.getElementById('cadastroModal');
const closeButtons = document.querySelectorAll('.close');

document.getElementById('openLogin').addEventListener('click', () => loginModal.style.display = 'block');
document.getElementById('openCadastro').addEventListener('click', () => cadastroModal.style.display = 'block');

closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    cadastroModal.style.display = 'none';
  });
});

document.getElementById('switchToCadastro').addEventListener('click', (e) => {
  e.preventDefault();
  loginModal.style.display = 'none';
  cadastroModal.style.display = 'block';
});

document.getElementById('switchToLogin').addEventListener('click', (e) => {
  e.preventDefault();
  cadastroModal.style.display = 'none';
  loginModal.style.display = 'block';
});

window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.style.display = 'none';
  if (e.target === cadastroModal) cadastroModal.style.display = 'none';
});

// Cadastro
document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('cadastroNome').value;
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroPassword').value;
  const confirm = document.getElementById('cadastroConfirmPassword').value;

  if (senha !== confirm) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
    await db.collection('usuarios').doc(userCredential.user.uid).set({
      nome: nome,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Conta criada com sucesso!');
    cadastroModal.style.display = 'none';
    document.getElementById('cadastroForm').reset();
  } catch (error) {
    alert('Erro: ' + (error.message || 'Falha no cadastro.'));
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginPassword').value;

  try {
    await auth.signInWithEmailAndPassword(email, senha);
    const user = auth.currentUser;
    const userDoc = await db.collection('usuarios').doc(user.uid).get();
    const nome = userDoc.exists ? userDoc.data().nome : 'Usuário';
    alert(`Bem-vindo, ${nome}!`);
    loginModal.style.display = 'none';
    document.getElementById('loginForm').reset();
  } catch (error) {
    alert('Erro: ' + (error.message || 'Login inválido.'));
  }
});

// Atualiza UI conforme login
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById('openLogin');
  const cadastroBtn = document.getElementById('openCadastro');
  if (user) {
    loginBtn.textContent = 'Perfil';
    cadastroBtn.style.display = 'none';
  } else {
    loginBtn.textContent = 'Login';
    cadastroBtn.style.display = 'block';
  }
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Busca (simulada)
function searchItems() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  alert(`Buscando: "${term}" (função simulada)`);
}
