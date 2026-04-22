let editingId = null
let instruments = []
let lastSearch = ""
let selectedCategory = ""
let currentPage = 1
let limit = 2

async function main(name = "", category = "", page = 1) {
  try {
    const response = await axios.get(`http://localhost:3000/?name=${name}&category=${category}&page=${page}&limit=${limit}`);

    const result = response.data

    instruments = result.data;
    currentPage = result.page;

    renderTable()
    renderPage(result)

  } catch (error) {
    console.error('Error: ', error);
  }
}

function renderTable() {
  const table = document.getElementById('tabela-instrumentos');

  table.innerHTML = "";

  if (instruments.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="not-found">
          <div>📂</div>
          Nenhum instrumento encontrado.
        </td>
      </tr>
    `;
    return;
  }


  instruments.forEach(instrument => {
    const row =
      `<tr>
          <td>${instrument.name}</td>
          <td>${instrument.category}</td>
          <td>${instrument.quantity_piece}</td>
          <td>${instrument.price}</td>
          <td class="actions">
            <button class="edit-button" onclick="editInstrument(${instrument.id})">
              <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z"/>
              <path d="M14 6l3 3"/>
              </svg>
            </button>
            <button class="delete-button" onclick="deleteInstrument(${instrument.id})">
              <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18"/>
              <path d="M8 6V4h8v2"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          </td>
        </tr>`;

    table.innerHTML += row;
  });
}

function renderPage(result) {
  const { page, totalPages, total } = result

  const container = document.querySelector(".pagination-buttons")
  const totalText = document.querySelector(".total-instrumentos p")

  container.innerHTML = ""
  totalText.textContent = `Total: ${total} instrumentos`


  const prev = document.createElement("button")
  prev.classList.add("button-pagina-anterior")
  prev.textContent = "<"

  if (page <= 1) {
    prev.disabled = true // Desabilita o botão na página 1
  } else {
    prev.onclick = () => main(lastSearch, selectedCategory, page - 1)
  }
  container.appendChild(prev)

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button")
    btn.classList.add("button-pagina")
    btn.textContent = i

    if (i === page) {
      btn.classList.add("ativo")
    }

    btn.onclick = () => main(lastSearch, selectedCategory, i)
    container.appendChild(btn)
  }

  const next = document.createElement("button")
  next.classList.add("button-pagina-proxima")
  next.textContent = ">"

  if (page >= totalPages) {
    next.disabled = true // Desabilita o botão se chegar no total de páginas
  } else {
    next.onclick = () => main(lastSearch, selectedCategory, page + 1)
  }
  container.appendChild(next)
}

function filterCategory(category) {
  selectedCategory = category

  const name = document.getElementById("buscar").value.trim()

  main(name, selectedCategory, 1)
}

async function searchInstruments() {
  try {
    const name = document.getElementById("buscar").value.trim()

    lastSearch = name

    main(name, selectedCategory, 1)

  } catch (error) {
    console.error("Erro na buscar:", error)
  }
}

async function showForm() {
  const form = document.querySelector('.modal');
  form.style.display = 'flex';
}

async function closeForm() {
  document.getElementById('modal').style.display = 'none';

  document.getElementById("name").value = ""
  document.getElementById("category").value = ""
  document.getElementById("quantity_pice").value = ""
  document.getElementById("price").value = ""
  editingId = null
}

window.addEventListener('click', function (event) {
  const modal = document.getElementById("modal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
});

async function createInstruments(id) {
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const quantity_piece = document.getElementById('quantity_piece').value;
  const price = document.getElementById('price').value;


  const newInstrument = {
    name: name,
    category: category,
    quantity_piece: quantity_piece,
    price: price
  };

  if (name == undefined || name.trim() == '') {
    alert('Preencha o campo "nome"')
    return
  }

  if (category === '') {
    alert('Preencha o campo "categoria"')
    return
  }

  if (quantity_piece === '') {
    alert('Preencha o campo "Peças"')
    return
  }

  if (price === '') {
    alert('Preencha o campo "preço"')
    return
  }

  try {
    await axios.post('http://localhost:3000/', newInstrument);

    alert('Instrumento criado com sucesso!');

    main(lastSearch, selectedCategory, currentPage)
  } catch (error) {
    console.error('Error: ', error);
    alert('Erro ao criar instrumento. Por favor, tente novamente.');
  }
}

async function deleteInstrument(id) {

  const confirmDelete = confirm('Você deseja excluir o instrumento?')

  if (!confirmDelete) {
    return
  }

  try {

    await axios.delete(`http://localhost:3000/${id}`)

    alert('Instrumento deletado com sucesso!')

    main(lastSearch, selectedCategory, currentPage)

  } catch (error) {
    console.error('Error: ', error)
    alert('Erro ao excluir instrumento. Por favor, tente novamente.')
  }
}



function editInstrument(id) {

  editingId = id

  const instrument = instruments.find(item => item.id == id)

  document.getElementById("name").value = instrument.name
  document.getElementById("category").value = instrument.category
  document.getElementById("quantity_piece").value = instrument.quantity_piece
  document.getElementById("price").value = instrument.price

  console.log("Instrumento encontrado:", instrument)

  showForm()
}

async function updateInstrument(id) {

  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const quantity_piece = document.getElementById("quantity_piece").value;
  const price = document.getElementById("price").value;


  try {

    await axios.put(`http://localhost:3000/${id}`, {
      name,
      category,
      quantity_piece,
      price
    })
    alert("Instrumento atualizado com sucesso!")

    main(lastSearch, selectedCategory, currentPage)

  } catch (error) {

    console.error(error)
    alert("Erro ao atualizar o instrumento, tente novamente!")

  }

}

async function saveInstrument() {
  if (editingId !== null) {
    await updateInstrument(editingId)
  } else {
    await createInstruments()
  }

  editingId = null
  closeForm()
}


window.onload = () => {
  main()

  const input = document.getElementById("buscar")

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      searchInstruments()
    }
  })
}

const selectLimit = document.querySelector("select[name='itens-por-paginas']")

selectLimit.addEventListener("change", (e) => {
  limit = Number(e.target.value)
  main(lastSearch, selectedCategory, 1)
})