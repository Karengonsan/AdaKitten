"use strict";
console.log("APPAdaKitten");

const listSection = document.querySelector(".js-list");
const buttonAddKitten = document.querySelector(".js-btn-add");
const newKittenForm = document.querySelector(".js-new-form");
const newImage = document.querySelector(".js-new-image");
const newName = document.querySelector(".js-new-name");
const newRace = document.querySelector(".js-new-race");
const newDescription = document.querySelector(".js-new-desc");
const buttonNewKitten = document.querySelector(".js-btn-new-kitten");
const buttonCancelForm = document.querySelector(".js-btn-cancel");
const formAddKitten = document.querySelector(".js-form-add");
const inputDescriptionSearch = document.querySelector(".js_in_search_desc");
const inputRaceSearch = document.querySelector(".js_in_search_race");

const kittenData1 = {
  image: "https://api-pw.dev.adalab.es/gato-siames.webp",
  name: "Anastacio",
  desc: "Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asía al menos hace 500 años, donde tuvo su origen muy posiblemente.",
  race: "Siames",
};

const kittenData2 = {
  image: "https://api-pw.dev.adalab.es/sphynx-gato.webp",
  name: "Fiona",
  desc: "Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.",
  race: "Sphynx",
};

const kittenData3 = {
  image: "https://api-pw.dev.adalab.es/maine-coon-cat.webp",
  name: "Cielo",
  desc: "Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.",
  race: "Maine Coon",
};

let kittenDataList = [kittenData1, kittenData2, kittenData3];

const kittenLocalStorage = JSON.parse(localStorage.getItem("kittens"));

if (kittenLocalStorage !== null) {
  kittenDataList = kittenLocalStorage;
}

let kittenIndexToEdit = null;

renderKittenList(kittenDataList);

function renderRace(race) {
  let breedText = "";
  if (race === "") {
    breedText = `Uy qué despiste, no sabemos su raza`;
  } else {
    breedText = race;
  }
  return breedText;
}

function renderKitten(kittenData, index) {
  let breedText = renderRace(kittenData.race);

  return `
            <li class="card">
                <article>
                    <img class="card_img" src="${kittenData.image}"
                        alt="${kittenData.race} cat" />
                    <h3 class="card_title">${kittenData.name.toUpperCase()}</h3>
                    <h4 class="card_race">${breedText}</h4>
                    <p class="card_description">
                        ${kittenData.desc}
                    </p>
                </article>
                <button data-index-number="${index}" class="btn_delete_cat">Eliminar</button>
                <button data-index-number="${index}" class="btn_edit_cat" href="#top">Editar</button>
            </li>
        `;
}

function renderKittenList(kittenDataList) {
  listSection.innerHTML = "";
  kittenDataList.forEach((kittenData, index) => {
    listSection.innerHTML += renderKitten(kittenData, index);
  });
}

const filterKitten = (event) => {
  const searchTextDescription = inputDescriptionSearch.value.toLowerCase();
  const searchTextRace = inputRaceSearch.value.toLowerCase();
  listSection.innerHTML = "";

  for (const [index, kittenItem] of kittenDataList.entries()) {
    if (
      (searchTextDescription === "" ||
        kittenItem.desc.toLowerCase().includes(searchTextDescription)) &&
      (searchTextRace === "" ||
        kittenItem.race.toLowerCase().includes(searchTextRace))
    ) {
      listSection.innerHTML += renderKitten(kittenItem, index);
    } 
  }
    if (listSection.innerHTML === "") {
      listSection.innerHTML = "No tenemos gatos con esas caracteristicas";
    }
};

const cancelNewKitten = (event) => {
  hideNewCatForm();
  formAddKitten.reset();
};

function showNewCatForm() {
  newKittenForm.classList.remove("collapsed");
}

function hideNewCatForm() {
  newKittenForm.classList.add("collapsed");
}

function handleClickNewCatForm(event) {
  if (newKittenForm.classList.contains("collapsed")) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}

function addNewKitten(event) {
    event.preventDefault()
  const newKittenImg = newImage.value;
  const newKittenName = newName.value;
  const newKittenRace = newRace.value;
  const newKittenDesc = newDescription.value;

  let newKittenDataAdded = {
    image: newKittenImg,
    name: newKittenName,
    desc: newKittenDesc,
    race: newKittenRace,
  };

  if (kittenIndexToEdit === null) {
    kittenDataList.push(newKittenDataAdded);
  } else {
    kittenDataList[kittenIndexToEdit] = newKittenDataAdded;
  }

  localStorage.setItem("kittens", JSON.stringify(kittenDataList));

  renderKittenList(kittenDataList);

  const allKittens = listSection.querySelectorAll(".card");

  allKittens[kittenIndexToEdit].scrollIntoView();
  kittenIndexToEdit = null;

  cancelNewKitten();
}

function handleClickDeleteKitten(event) {
  if (event.target.classList.contains("btn_delete_cat")) {
    let buttonIndex = event.target.dataset.indexNumber;

    kittenDataList.splice(parseInt(buttonIndex), 1);

    localStorage.setItem("kittens", JSON.stringify(kittenDataList));

    renderKittenList(kittenDataList);
  }
}

function handleClickEditKitten(event) {
  if (event.target.classList.contains("btn_edit_cat")) {
    kittenIndexToEdit = parseInt(event.target.dataset.indexNumber);

    showNewCatForm();
    newKittenForm.scrollIntoView();

    newImage.value = kittenDataList[kittenIndexToEdit].image;
    newName.value = kittenDataList[kittenIndexToEdit].name;
    newRace.value = kittenDataList[kittenIndexToEdit].race;
    newDescription.value = kittenDataList[kittenIndexToEdit].desc;
  }
}

renderKittenList(kittenDataList);

formAddKitten.addEventListener("submit", addNewKitten)
buttonCancelForm.addEventListener("click", cancelNewKitten);
buttonAddKitten.addEventListener("click", handleClickNewCatForm);
inputDescriptionSearch.addEventListener("input", filterKitten);
inputRaceSearch.addEventListener("input", filterKitten);
listSection.addEventListener("click", handleClickDeleteKitten);
listSection.addEventListener("click", handleClickEditKitten);
