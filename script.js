//Liaison avec la base de données dans supabase
//import { createClient } from '@supabase/supabase-js'

const url = "https://ncuuxjriepukvxmzvsex.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXV4anJpZXB1a3Z4bXp2c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMjQwNjksImV4cCI6MjAzNjcwMDA2OX0.rGlEkaOdFtyMIimcsJ_Z6gFue8or3uXwjOM1CjkYX20";
const database = supabase.createClient(url, key)
console.log(database);

//Déclaration des vriable
let ideas = [];
let categories = [];

// Fonction pour récupérer les catégories
async function fetchCategories() {
    const { data, error } = await database
        .from('categories')
        .select('*');

    if (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return;
    }

    categories = data;
    populateCategorySelect();
}

// Fonction pour peupler le select des catégories
function populateCategorySelect() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Fonction pour récupérer les idées
async function fetchIdeas() {
    const { data, error } = await database
        .from('ideas')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erreur lors de la récupération des idées:', error);
        return;
    }

    ideas = data;
    displayIdeas();
}

// Gestionnaire de soumission du formulaire
document.getElementById('ideaForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;

    const description = document.getElementById('description').value;

    if (title === '' || category_id === '' || description === '') {
        showMessage('Tous les champs doivent être remplis', 'error');
        return;
    }

    const { data, error } = await database
        .from('ideas')
        .insert([{ title, category_id, description }]);

    if (error) {
        showMessage('Erreur lors de l\'ajout de l\'idée', 'error');
        console.error('Error adding idea:', error);
        return;
    }

    showMessage('Idée ajoutée avec succès', 'success');
    document.getElementById('ideaForm').reset();
    fetchIdeas();
});

// Fonction pour afficher un message
function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 2000);
}

// Fonction pour afficher les idées
function displayIdeas() {
    const ideasContainer = document.getElementById('ideasContainer');
    ideasContainer.innerHTML = '';

    ideas.forEach((idea) => {
        const ideaElement = document.createElement('div');
        ideaElement.className = 'idea';
        ideaElement.innerHTML = `
            <h3>${idea.title}</h3>
            <p>Catégorie: ${idea.categories.name}</p>
            <p>${idea.description}</p>
            <div class="actions">
                <button onclick="toggleApproval('${idea.id}')">${idea.approved ? 'Désapprouver' : 'Approuver'}</button>
                <button onclick="deleteIdea('${idea.id}')">Supprimer</button>
            </div>
        `;
        ideasContainer.appendChild(ideaElement);
    });
}

// Fonction pour approuver ou désapprouver une idée
async function toggleApproval(id) {
    const idea = ideas.find(i => i.id === id);
    const { data, error } = await supabase
        .from('ideas')
        .update({ approved: !idea.approved })
        .eq('id', id);

    if (error) {
        console.error('Erreur lors de la mise à jour de l\'idée:', error);
        return;
    }

    fetchIdeas();
}

// Fonction pour supprimer une idée
async function deleteIdea(id) {
    const { data, error } = await database
        .from('ideas')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erreur lors de la suppression de l\'idée:', error);
        return;
    }

    fetchIdeas();
}

// Récupération initiale des catégories et des idées
fetchCategories();
fetchIdeas();




// // document.getElementById('addIdea').addEventListener('submit', function(e){
// //     e.preventDefault();
// //     let valid =true;


// //     document.getElementById('titreError').innerHTML="Veuillez saisir un titre d'au moins 5 caractères";
// //     document.getElementById('descriptionError').innerHTML="Veuillez saisir une description d'au moins 10 caractères";
// //     document.getElementById('categorieError').innerHTML="Choisissez une catégorie pour continuer";

// //     const titre = document.getElementById('titre').Value;
// //     if (titre.legth < 3 || titre.legth > 50 ){
// //         document.getElementById('titreError').innerHTML="Veuillez saisir un titre d'au moins 5 caractères";
// //         valid = false;
// //     }

// //     //Condition de validité du champs description
// //     const description = document.getElementById('description').value;
// //     if (description.length <10 || description.length >5000){
// //         document.getElementById('descriptionError').innerHTML="Veuillez saisir une description d'au moins 10 caractères";
// //         valid = false;
// //     }

// //     if(valid){
// //         document.getElementById('addIdea').style.display = 'none';
// //         document.getElementById('succesMessage')
// //     }
// // // });

// const Ideas = [
//     {id:1, title: 'Messi, le messi', description:'Lionnel Messi l\'incontournable joueur de tous les temps', categorie:'Sport'},
// ];
// function getAllIdeas(){
//     ideas.forEach(element => {
//         document.querySelector("tbody").innerHTML +=
//                     `<tr>
//                         <th scope="row">${element.id}</th>
//                         <td>${element.titre}</td>
//                         <td>${element.categorie}</td>
//                         <td>${element.description}</td>
//                         <td>
//                             <button class="btnDelete"><i class="fa-solid fa-trash"></i></button>
//                             <button class="btnUpdate"><i class="fa-solid fa-pen-to-square"></i></button>
//                         </td>
//                     </tr>`;
//     });
// }

// getAllIdeas();

// //Ajout d'une idée
// function addIdea(title, description, categorie){
//     let id = Ideas.length + 1;
//     let newIdea = {id, title, description, categorie};
//     Ideas.push(newIdea);
//     console.log('Nouvelle idée ajoutée :', newIdea);
//     getAllIdeas();
// }
// document.getElementById('addIdea').addEventListener('submit', function(e){
//     e.preventDefault();
//     let valid = true;

//     document.getElementById('titreError').innerHTML = "";
//     document.getElementById('descriptionError').innerHTML = "";
//     document.getElementById('categorieError').innerHTML = "";

//     const titre = document.getElementById('titre').value;
//     if (titre.length < 5 || titre.length > 50){
//         document.getElementById('titreError').innerHTML = "Veuillez saisir un titre d'au moins 5 caractères";
//         valid = false;
//     }

//     const description = document.getElementById('description').value;
//     if (description.length < 10 || description.length > 5000){
//         document.getElementById('descriptionError').innerHTML = "Veuillez saisir une description d'au moins 10 caractères";
//         valid = false;
//     }

//     const categorie = document.getElementById('categorie').value;
//     if (categorie === ""){
//         document.getElementById('categorieError').innerHTML = "Choisissez une catégorie pour continuer";
//         valid = false;
//     }

//     if(valid){
//         addIdea(titre, description, categorie);
//         document.getElementById('addIdea').reset();
//         document.getElementById('succesMessage').style.display = 'block';
//         setTimeout(() => {
//             document.getElementById('succesMessage').style.display = 'none';
//         }, 3000);
//     }
// });

// const ideas = [
//     {id: 1, title: 'Messi, le messi', description: 'Lionnel Messi l\'incontournable joueur', categorie: 'Sport'},
// ];

// function getAllIdeas(){
//     document.querySelector("tbody").innerHTML = ""; // Clear existing rows
//     ideas.forEach(element => {
//         document.querySelector("tbody").innerHTML +=
//             `<tr>
//                 <th scope="row">${element.id}</th>
//                 <td>${element.title}</td>
//                 <td>${element.categorie}</td>
//                 <td>${element.description}</td>
//                 <td>
//                     <button class="btnDelete"><i class="fa-solid fa-trash"></i></button>
//                     <button class="btnUpdate"><i class="fa-solid fa-pen-to-square"></i></button>
//                 </td>
//             </tr>`;
//     });
// }

// getAllIdeas();

// function addIdea(title, description, categorie){
//     let id = ideas.length + 1;
//     let newIdea = {id, title, description, categorie};
//     ideas.push(newIdea);
//     console.log('Nouvelle idée ajoutée :', newIdea);
//     getAllIdeas();
// // }
// document.getElementById('addIdea').addEventListener('submit', function(e){
//     e.preventDefault();
//     let valid = true;

//     document.getElementById('titreError').innerHTML = "";
//     document.getElementById('descriptionError').innerHTML = "";
//     document.getElementById('categorieError').innerHTML = "";

//     const titre = document.getElementById('titre').value;
//     if (titre.length < 5 || titre.length > 50){
//         document.getElementById('titreError').innerHTML = "Veuillez saisir un titre d'au moins 5 caractères";
//         valid = false;
//     }

//     const description = document.getElementById('description').value;
//     if (description.length < 10 || description.length > 5000){
//         document.getElementById('descriptionError').innerHTML = "Veuillez saisir une description d'au moins 10 caractères";
//         valid = false;
//     }

//     const categorie = document.getElementById('categorie').value;
//     if (categorie === ""){
//         document.getElementById('categorieError').innerHTML = "Choisissez une catégorie pour continuer";
//         valid = false;
//     }

//     if(valid){
//         addIdea(titre, description, categorie);
//         document.getElementById('addIdea').reset();
//         document.getElementById('succesMessage').style.display = 'block';
//         setTimeout(() => {
//             document.getElementById('succesMessage').style.display = 'none';
//         }, 3000);
//     }
// });

// liste = document.querySelector("listeIdeaId");
// const ideas = [
//     {id: 1, titre: 'Messi, le messi', description: 'Lionnel Messi l\'incontournable joueur', categorie: 'Sport'},
// ];

// function getAllIdeas(){
//     document.querySelector("tbody").innerHTML = ""; 
//     ideas.forEach(element => {
//         document.querySelector("tbody").innerHTML +=
//             `<tr>
//                 <th scope="row">${element.id}</th>
//                 <td>${element.titre}</td>
//                 <td>${element.categorie}</td>
//                 <td>${element.description}</td>
//                 <td>
//                     <button class="btnDelete"><i class="fa-solid fa-trash"></i></button>
//                     <button class="btnUpdate"><i class="fa-solid fa-pen-to-square"></i></button>
//                 </td>
//             </tr>`;
//     });
// }

// getAllIdeas();

// function ShowIdea(){

// }

// function addIdea(titre, description, categorie){
//     let id = ideas.length + 1;
//     let newIdea = {id, titre, description, categorie};
//     ideas.push(newIdea);
//     console.log('Nouvelle idée ajoutée :', newIdea);
//     getAllIdeas();
// }