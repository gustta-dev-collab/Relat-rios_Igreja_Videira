let relatorios = JSON.parse(localStorage.getItem('videira_reports')) || [];

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.toggle('hidden');
}

function salvarRelatorio(e) {
    e.preventDefault();

    const novoRelatorio = {
        id: Date.now(),
        pastor: document.getElementById('pastor').value,
        lider: document.getElementById('lider').value,
        liderEmTreinamento: document.getElementById('lider_treinamento').value,
        celula: document.getElementById('celula').value,
        visitantes: Number(document.getElementById('visitantes').value) || 0,
        frequentadores: Number(document.getElementById('frequentadores').value) || 0,
        membros: Number(document.getElementById('membros').value) || 0,
        valordaoferta: Number(document.getElementById('oferta').value) || 0,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    relatorios.push(novoRelatorio);
    localStorage.setItem('videira_reports', JSON.stringify(relatorios));

    e.target.reset();
    toggleModal('modalForm');
    renderizar();
    atualizarTotais();
}

function excluirRelatorio(id) {
    if (confirm('Deseja realmente excluir este relatório?')) {
        relatorios = relatorios.filter(r => r.id !== id);
        localStorage.setItem('videira_reports', JSON.stringify(relatorios));
        renderizar();
        atualizarTotais();
    }
}

function atualizarTotais() {
    let visitantes = 0;
    let frequentadores = 0;
    let membros = 0;
    let ofertas = 0;

    relatorios.forEach(r => {
        visitantes += r.visitantes;
        frequentadores += r.frequentadores;
        membros += r.membros;
        ofertas += r.valordaoferta;
    });

    document.getElementById("totalVisitantes").innerText = visitantes;
    document.getElementById("totalFrequentadores").innerText = frequentadores;
    document.getElementById("totalMembros").innerText = membros;
    document.getElementById("totalOfertas").innerText =
        ofertas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderizar() {
    const lista = document.getElementById('listaRelatorios');
    if (!lista) return;

    if (relatorios.length === 0) {
        lista.innerHTML = `<p class="text-center text-gray-500">Nenhum relatório salvo.</p>`;
        return;
    }

    lista.innerHTML = relatorios.map(r => `
        <div class="relative report-card p-6 rounded-3xl text-white space-y-2">

            <button onclick="excluirRelatorio(${r.id})"
                class="absolute top-4 right-4 text-red-400 hover:text-red-600">
                🗑️
            </button>

            <h3 class="text-xl font-bold text-blue-400">${r.celula}</h3>
            <p class="text-sm text-gray-300">Líder: ${r.lider}</p>

            <div class="flex gap-2 pt-2">
                <button onclick="gerarPDF(${r.id})"
                    class="bg-emerald-600 px-3 py-1 rounded text-xs font-bold">
                    Gerar PDF
                </button>
            </div>

            <div class="flex justify-between pt-3 border-t border-white/10">
                <span class="text-xs text-gray-400">${r.data} • ${r.hora}</span>
                <strong>${r.membros} pessoas</strong>
            </div>
        </div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('celulaForm');
    if (form) form.addEventListener('submit', salvarRelatorio);
    renderizar();
    atualizarTotais();
});
