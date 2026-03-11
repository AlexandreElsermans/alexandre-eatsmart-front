import './style.css'

interface Article {
  id: number;
  nom: string;
  prix: number;
  description: string;
}

let appDiv = document.querySelector<HTMLDivElement>("#app"); // Sélection de la div avec l'id "app"

async function chargerArticles(): Promise<Article[]> {
  const response = await fetch("http://alexandre-api-eatsmart/articles"); // Appel de l'API pour récupérer les articles
  return await response.json();
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
  appDiv.innerHTML = carte.map(p => structureArticles(p)).join("");
}