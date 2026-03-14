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

let appDiv = document.querySelector<HTMLDivElement>("#app"); // Sélection de la div avec l'id "app"

async function chargerArticles(): Promise<Article[]> {
  const response = await fetch('http://alexandre-api-eatsmart/articles'); // Appel de l'API pour récupérer les articles
  return await response.json();
}

async function chargerCategories(): Promise<Categorie[]> {
  const response = await fetch('http://alexandre-api-eatsmart/categories');
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
  return `
    <div class="carte">
      <section class="article">
        <h3>${article.nom}</h3>
        <p>${article.description}</p>
        <p><strong>${article.prix}€</strong></p>
      </section>
    </div>
  `
}

if (appDiv) {
  const carte = await chargerArticles(); // Récupération des articles depuis l'API
  const page = await chargerCategories(); // Récupération des catégories depuis l'API
  appDiv.innerHTML = page.map(page => structurePages(page)).join("");

  carte.forEach(c => {
      const categorieArticleID = document.querySelector(`#cat_${c.id_categorie} .articles`);
      if (categorieArticleID) {
        categorieArticleID.innerHTML += structureArticles(c);
      } else {
        console.error(`La catégorie avec l'id ${c.id_categorie} n'existe pas.`);
      }
    });
}