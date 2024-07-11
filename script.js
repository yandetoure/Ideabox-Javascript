// document.getElementById('addIdea').addEventListener('submit', function(e){
//     e.preventDefault();
//     let valid =true;


//     document.getElementById('titreError').innerHTML="Veuillez saisir un titre d'au moins 5 caractères";
//     document.getElementById('descriptionError').innerHTML="Veuillez saisir une description d'au moins 10 caractères";
//     document.getElementById('categorieError').innerHTML="Choisissez une catégorie pour continuer";

//     const titre = document.getElementById('titre').Value;
//     if (titre.legth < 3 || titre.legth > 50 ){
//         document.getElementById('titreError').innerHTML="Veuillez saisir un titre d'au moins 5 caractères";
//         valid = false;
//     }

//     //Condition de validité du champs description
//     const description = document.getElementById('description').value;
//     if (description.length <10 || description.length >5000){
//         document.getElementById('descriptionError').innerHTML="Veuillez saisir une description d'au moins 10 caractères";
//         valid = false;
//     }

//     if(valid){
//         document.getElementById('addIdea').style.display = 'none';
//         document.getElementById('succesMessage')
//     }
// });
let data = [
    { id: 1, titre: "L'éducation des jeunes", description: "Le monde dans lequel nous vivons est en perpetuel changement..." },
    { id: 2, titre: "La santé", description: "La santé est la clé pour une bonne société..." },
    { id: 3, titre: "L'économie", description: "L'économie est la base de la société..." },
    { id: 4, titre: "La politique", description: "La politique est la voie vers la société..." },
    { id: 5, titre: "La démocratie", description: "La démocratie est la base de la société..." }
];

function readAll() {
    if (!localStorage.getItem("object")) {
        localStorage.setItem("object", JSON.stringify(data));
    }
    const tabledata = document.querySelector('.data_table');
    const object = localStorage.getItem("object");
    const data = JSON.parse(object);
    let elements = "";

    data.forEach(record => {
        elements += `
            <tr>
                <td>${record.titre}</td>
                <td>${record.description}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteIdea(${record.id})">Supprimer</button>
                    <button class="btn btn-warning btn-sm" onclick="editIdea(${record.id})">Modifier</button>
                </td>
            </tr>
        `;
    });

    tabledata.innerHTML = elements;
}

function create(event) {
    event.preventDefault();
    const titre = document.getElementById('titre').value.trim();
    const description = document.getElementById('description').value.trim();
    const categorie = document.getElementById('categorie').value;

    if (validateForm(titre, description, categorie)) {
        const object = JSON.parse(localStorage.getItem("object"));
        const newId = object.length ? object[object.length - 1].id + 1 : 1;
        const newIdea = { id: newId, titre, description };
        object.push(newIdea);
        localStorage.setItem("object", JSON.stringify(object));
        readAll();
        document.getElementById('addIdea').reset();
        document.getElementById('successMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 3000);
    }
}

function validateForm(titre, description, categorie) {
    let valid = true;

    if (titre.length < 3 || titre.length > 50) {
        document.getElementById('titreError').innerText = "Veuillez saisir un titre d'au moins 3 caractères.";
        valid = false;
    } else {
        document.getElementById('titreError').innerText = "";
    }

    if (description.length < 10 || description.length > 5000) {
        document.getElementById('descriptionError').innerText = "Veuillez saisir une description d'au moins 10 caractères.";
        valid = false;
    } else {
        document.getElementById('descriptionError').innerText = "";
    }

    if (categorie === "0") {
        document.getElementById('categorieError').innerText = "Choisissez une catégorie pour continuer.";
        valid = false;
    } else {
        document.getElementById('categorieError').innerText = "";
    }

    return valid;
}

function deleteIdea(id) {
    let object = JSON.parse(localStorage.getItem("object"));
    object = object.filter(record => record.id !== id);
    localStorage.setItem("object", JSON.stringify(object));
    readAll();
}

function editIdea(id) {
    const object = JSON.parse(localStorage.getItem("object"));
    const idea = object.find(record => record.id === id);
    document.getElementById('titre').value = idea.titre;
    document.getElementById('description').value = idea.description;
    document.getElementById('categorie').value = idea.categorie;
    
    deleteIdea(id); // Remove the idea to be updated

    // Scroll to form
    window.scrollTo(0, 0);
}
