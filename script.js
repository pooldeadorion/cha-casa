import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 🔴 SUBSTITUA O BLOCO ABAIXO PELAS SUAS CHAVES DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyC3ZORPwqzwW3pWSwe_CVAlVwxD8NvQwa0",
    authDomain: "casa-cha-nova.firebaseapp.com",
    databaseURL: "https://casa-cha-nova-default-rtdb.firebaseio.com",
    projectId: "casa-cha-nova",
    storageBucket: "casa-cha-nova.firebasestorage.app",
    messagingSenderId: "1091147460171",
    appId: "1:1091147460171:web:5ba636663acd08355f67ce"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Lista Completa de Presentes
const items = [
    { id: 'k1', name: 'Jogo de Copo', category: 'kitchen', icon: '🥛' },
    { id: 'k2', name: 'Jogo de Prato', category: 'kitchen', icon: '🍽️' },
    { id: 'k3', name: 'Talheres', category: 'kitchen', icon: '🍴' },
    { id: 'k4', name: 'Jogo de Xícaras', category: 'kitchen', icon: '☕' },
    { id: 'k5', name: 'Frigideira Antiaderente', category: 'kitchen', icon: '🍳' },
    { id: 'k6', name: 'Potes Herméticos', category: 'kitchen', icon: '🫙' },
    { id: 'k7', name: 'Escorredor de Louça', category: 'kitchen', icon: '🍽️' },
    { id: 'k8', name: 'Panos de Prato', category: 'kitchen', icon: '🧻' },
    { id: 'k9', name: 'Batedeira', category: 'kitchen', icon: '🥣' },
    { id: 'k10', name: 'Liquidificador', category: 'kitchen', icon: '🍹' },
    { id: 'c1', name: 'Baldes', category: 'cleaning', icon: '🪣' },
    { id: 'c2', name: 'Rodo e Vassoura', category: 'cleaning', icon: '🧹' },
    { id: 'c3', name: 'Lixeiras', category: 'cleaning', icon: '🗑️' },
    { id: 'b1', name: 'Chuveiro', category: 'bathroom', icon: '🚿' },
    { id: 'b2', name: 'Toalhas de Rosto e Corpo', category: 'bathroom', icon: '🧺' },
    { id: 'b3', name: 'Tapete Anti Derrapante', category: 'bathroom', icon: '🟫' },
    { id: 'q1', name: 'Jogo de Cama', category: 'bedroom', icon: '🛏️' },
    { id: 'q2', name: 'Lençóis', category: 'bedroom', icon: '🛌' },
    { id: 's1', name: 'Tapete de Sala', category: 'living-room', icon: '🟫' },
    { id: 's2', name: 'Vasos de Plantas', category: 'living-room', icon: '🪴' }
];

let selectedItem = null;

// Desenha os itens na tela
function renderLayout() {
    items.forEach(item => {
        const container = document.getElementById(`${item.category}-items`);
        if (container) {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.id = `card-${item.id}`;
            card.innerHTML = `
                <span class="item-icon">${item.icon}</span>
                <span class="item-text">${item.name}</span>
                <span class="badge" id="badge-${item.id}"></span>
            `;
            card.onclick = () => openModal(item);
            container.appendChild(card);
        }
    });
}

// Escuta as alterações no Firebase em tempo real
function listenRealtime() {
    const reservationsRef = ref(db, 'reservas');
    onValue(reservationsRef, (snapshot) => {
        const data = snapshot.val() || {};
        
        items.forEach(item => {
            const card = document.getElementById(`card-${item.id}`);
            const badge = document.getElementById(`badge-${item.id}`);
            
            if (data[item.id]) {
                // Item já foi reservado por alguém
                card.classList.add('reserved');
                badge.innerText = `🔒 Por: ${data[item.id].by}`;
                badge.style.display = 'inline-block';
            } else {
                // Item livre
                card.classList.remove('reserved');
                badge.style.display = 'none';
            }
        });
    });
}

// Modal
function openModal(item) {
    const card = document.getElementById(`card-${item.id}`);
    if (card.classList.contains('reserved')) return; // Não faz nada se já estiver reservado

    selectedItem = item;
    document.getElementById('modalItemName').innerText = item.name;
    document.getElementById('reserveModal').classList.add('active');
}

window.closeModal = function() {
    document.getElementById('reserveModal').classList.remove('active');
    document.getElementById('reserverName').value = '';
    selectedItem = null;
}

// Grava a reserva no banco de dados online
window.confirmReservation = function() {
    const name = document.getElementById('reserverName').value.trim();
    if (!name) {
        alert('Por favor, digite seu nome!');
        return;
    }

    if (selectedItem) {
        set(ref(db, `reservas/${selectedItem.id}`), {
            by: name,
            date: new Date().toISOString()
        }).then(() => {
            closeModal();
        }).catch((err) => {
            alert("Erro ao salvar reserva. Verifique sua conexão.");
            console.error(err);
        });
    }
}

renderLayout();
listenRealtime();