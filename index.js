let editingId = null
let instruments = []

async function main() {
  try {
    const response = await axios.get('http://localhost:3000/');

    instruments = response.data;

    const table = document.getElementById('tabela-instrumentos');

    console.log(instruments);
    
    table.innerHTML = "";

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
    });} catch (error) {
    console.error('Error: ', error);
  }
}

async function showForm() {
  const form = document.querySelector('.modal');
  form.style.display = 'flex';
}

async function closeForm() {
  document.getElementById('modal').style.display = 'none';
}

window.addEventListener('click', function(event) { 
  const modal = document.getElementById("modal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", function(event) {
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

  if(name == undefined || name.trim() == '' ){
    alert('Preencha o campo "nome"')
    return
  }
  
  if(category === ''){
    alert('Preencha o campo "categoria"')
    return
  }

  if(quantity_piece === ''){
    alert('Preencha o campo "Peças"')
    return
  }

  if(price === ''){
    alert('Preencha o campo "preço"')
    return
  }

  try{
    await axios.post('http://localhost:3000/', newInstrument);
    
    alert('Instrumento criado com sucesso!');

    location.reload();
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
    
    location.reload()

  } catch (error) {
    console.error('Error: ', error)
    alert('Erro ao excluir instrumento. Por favor, tente novamente.')
  }
}



 function editInstrument(id){

  editingId = id
  
  const instrument = instruments.find (item => item.id == id)

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
    
    await axios.put(`http://localhost:3000/${id}`,{
      name,
      category,
      quantity_piece,
      price
    })
    alert("Instrumento atualizado com sucesso!")

    location.reload()

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
}


window.onload = main;