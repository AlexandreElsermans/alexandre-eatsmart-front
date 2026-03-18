import './style.css'

interface Article {
  id: number;
  nom: string;
  prix: number;
  description: string;
  id_categorie: number;
}

interface Categorie {
  id_categorie: number;
  nom: string;
}

let appDiv = document.querySelector<HTMLDivElement>("#app"); // Sélection de la div avec l'id "content-wrapper"

async function chargerArticles(): Promise<Article[]> {
  const response = await fetch('http://alexandre-api-eatsmart/articles'); // Appel de l'API pour récupérer les articles
  return await response.json();
}

async function chargerCategories(): Promise<Categorie[]> {
  const response = await fetch('http://alexandre-api-eatsmart/categories'); // Appel de l'API pour récupérer les catégories
  return await response.json();
}

function structurePages(categorie: Categorie): string {
  return `
    <div class="categorie" id="cat_${categorie.id_categorie}">
      <h1>${categorie.nom}</h1>
      <div class="articles"></div>
    </div>
  `
}

function structureArticles(article: Article): string {
  if (article.prix < 10) {
    return `
      <div class="carte">
        <section class="article">
          <h3>${article.nom}</h3>
          <p>${article.description}</p>
          <p><strong>${article.prix}€</strong></p>
          <button class="btn-order">Ajouter</button>
          <p><strong>🔥Bon plan</strong></p>
        </section>
      </div>
    `
  }
  return `
    <div class="carte">
      <section class="article">
        <h3>${article.nom}</h3>
        <p>${article.description}</p>
        <p><strong>${article.prix}€</strong></p>
        <button class="btn-order">Ajouter</button>
      </section>
    </div>
  `
}

function structurePanier(prix: number = 0): string {
  return `
    <aside class="cart-container">
        <h2>Votre Panier</h2>
        <div id="cart-items">
          <p>Votre panier est vide</p>
        </div>
        <hr>
        <div class="cart-total">
          <strong>Total : <span id="total-prix">${prix}</span>€</strong>
        </div>
    </aside>
    </div>
  `
} 

const carte = await chargerArticles(); // Récupération des articles depuis l'API
const page = await chargerCategories(); // Récupération des catégories depuis l'API

if (appDiv) { // Mise en place du header
  appDiv.innerHTML = `
    <header class="main-header">
        <img src="public/logo_eatsmart.jpg" alt="EatSmart logo" class="logo-img">
        <h1 class="eatsmart-title">EatSmart - Carte du restaurant</h1>
    </header>

    <div class="content-wrapper">
      <div class="menu-container">
        ${page.map(p => structurePages(p)).join('') /* Création des catégories */}
      </div>
      ${structurePanier() /* Création du panier vide */}
    </div>
  `;

  carte.forEach(c => { // Ajout des articles dans leur catégorie
      const categorieArticleID = document.querySelector(`#cat_${c.id_categorie} .articles`); // Sélection de la div "articles" correspondant à la catégorie de l'article
      if (categorieArticleID) {
        categorieArticleID.innerHTML += structureArticles(c);
      } else {
        console.error(`La catégorie avec l'id ${c.id_categorie} n'existe pas.`); // Gestion des erreurs si la catégorie n'existe pas
      }
    });
}

const allButton = document.querySelectorAll<HTMLButtonElement>(".btn-order"); // Recherche tous les boutons de la page avec la classe btn-order
const cartItem = document.querySelector<HTMLDivElement>('#cart-items p'); // Recherche la balise paragraphe dans l'id cart-items
const cartTotal = document.querySelector("#total-prix"); // Récupère la balise contenant le prix total

let panier: Article[] = [];

allButton.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (cartItem?.innerHTML === "Votre panier est vide") {
      cartItem.innerHTML = ""; // Au premier ajout, suppression du contenu de la balise <p>
    }
    const plat = carte[index];
    panier.push(plat);
    cartItem.innerHTML += `<p><strong>${plat.nom}</strong> ${plat.prix}€</p>`; // Affichage dynamique du contenu du panier
    cartTotal.innerHTML = (parseFloat(cartTotal.innerHTML) + parseFloat(plat.prix)).toString(); // Mise à jour dynamique du prix total 
  })
});