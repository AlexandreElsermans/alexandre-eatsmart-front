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

interface InsertCommandeDTO {
  date_commande: string;
  prix_total: number;
  etat: string;
}

let appDiv = document.querySelector<HTMLDivElement>("#app"); // Sélection de la div avec l'id "content-wrapper"

function clearPrice(prix: number): number {
  return (Math.round(prix * 100) / 100);
}

async function chargerArticles(): Promise<Article[]> {
  const response = await fetch('http://alexandre-api-eatsmart/articles'); // Appel de l'API pour récupérer les articles
  return await response.json();
}

async function chargerCategories(): Promise<Categorie[]> {
  const response = await fetch('http://alexandre-api-eatsmart/categories'); // Appel de l'API pour récupérer les catégories
  return await response.json();
}

async function envoyerData<T>(commande: T) {
  try {
    const envoie = await fetch('http://alexandre-api-eatsmart/commandes/', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(commande)
    });

    
  const responseText = await envoie.text();
  console.log("Réponse brute du serveur:", responseText);

    if (envoie.ok) {
        const result = await envoie.json();
        console.log('Succès :', result);
    } else {
      console.error('Erreur serveur : ', envoie.status);
    }

  } catch (e) {
    console.error("Erreur détectée : ", e);
  }
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
          <p><strong>${clearPrice(article.prix)}€</strong></p>
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
        <p><strong>${clearPrice(article.prix)}€</strong></p>
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
          <strong>Total : <span id="total-prix">${clearPrice(prix)}</span>€</strong>
        </div>
        <div class="validCommande">
          <button class="buttonCommander" type="submit">Valider commande</button>
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

const validCommandButton = document.querySelectorAll<HTMLButtonElement>(".buttonCommander");
const ajoutButton = document.querySelectorAll<HTMLButtonElement>(".btn-order"); // Recherche tous les boutons de la page avec la classe btn-order
const cartItem = document.querySelector<HTMLDivElement>('#cart-items p'); // Recherche la balise paragraphe dans l'id cart-items
const cartTotal = document.querySelector("#total-prix"); // Récupère la balise contenant le prix total

let panier: Article[] = [];

ajoutButton.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    if (cartItem?.innerHTML === "Votre panier est vide") {
      cartItem.innerHTML = ""; // Au premier ajout, suppression du contenu de la balise <p>
    }

    const plat = carte[index];
    panier.push(plat);
    cartItem.innerHTML += `<p><strong>${plat.nom}</strong> ${clearPrice(plat.prix)}€</p>`; // Affichage dynamique du contenu du panier
    cartTotal.innerHTML = (parseFloat(cartTotal.innerHTML) + clearPrice(parseFloat(plat.prix))).toString(); // Mise à jour dynamique du prix total 
  })
});

validCommandButton.forEach(btn => {
  btn.addEventListener('click', () => {
    
    const maintenant = new Date();
    const dateMySQL = maintenant.toISOString().slice(0, 19).replace('T', ' ');

    const recupPrice = document.querySelector("#total-prix");
    let priceToPay: number = parseFloat(recupPrice.innerHTML);
    priceToPay = Math.round(priceToPay * 100) / 100;

    const etatCommande: string = "En cours";

    const objetTest: InsertCommandeDTO = {
      date_commande: dateMySQL,
      prix_total: priceToPay,
      etat: etatCommande,
    };
    
    envoyerData(objetTest);
  })
});
