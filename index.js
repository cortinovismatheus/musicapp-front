async function main() {
  try {
    const response = await axios.get('http://localhost:3000/');
    const instruments = response.data;

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
            <button class="edit-button" onclick="editInstrument(${instrument.id})">✏️</button>
            <button class="delete-button" onclick="deleteInstrument(${instrument.id})">🗑️</button>
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

  try{
    await axios.post('http://localhost:3000/', newInstrument);
    
    alert('Instrumento criado com sucesso!');

    location.reload();
  } catch (error) {
    console.error('Error: ', error);
    alert('Erro ao criar instrumento. Por favor, tente novamente.');
  }
}

window.onload = main;