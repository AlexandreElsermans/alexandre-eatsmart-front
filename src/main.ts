import './style.css'

interface Article {
  id: number;
  nom: string;
  prix: number;
  description: string;
}

const carte: Article[] = [
  {id:1,nom:"Anchois 23cm",prix:7.9,description:"sauce tomate premium, origan, huile d'olive extra vierge, anchois, olive"},
  {id:2,nom:"Anchois 33cm",prix:11.9,description:"sauce tomate premium, origan, huile d'olive extra vierge, anchois, olive"},
  {id:3,nom:"Emmental 23cm",prix:7.9,description:"sauce tomate premium, origan, huile d'olive extra vierge, emmental, basilic, olive"},
]

let appDiv = document.querySelector<HTMLDivElement>("#app");

function structureArticles(article: Article): string {
  return `
    <div class="carte">
      <section class="article">
        <h2>${article.nom}</h2>
        <p>${article.description}</p>
        <p><strong>${article.prix}€</strong></p>
      </section>
    </div>
  `
}

if (appDiv) {
  appDiv.innerHTML = carte.map(p => structureArticles(p)).join("");
}