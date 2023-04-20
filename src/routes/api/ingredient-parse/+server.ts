import type { RequestHandler } from '../$types';
import axios from 'axios';
import cheerio from 'cheerio';

interface RecipeLinks {
	recipeLinks: string[];
}

export const POST: RequestHandler = async ({ request }) => {
	const { recipeLinks } = await request.json();

	if (!recipeLinks || recipeLinks.length === 0) {
		return new Response('No recipe links provided', {
			status: 400
		});
	}

	try {
		const groceryList = await generateGroceryList(recipeLinks);
		return new Response(JSON.stringify(groceryList), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response('Failed to generate grocery list', {
			status: 500
		});
	}
};

async function generateGroceryList(recipeLinks: string[]) {
	const ingredientsList: string[] = [];
	for (const link of recipeLinks) {
		const ingredients = await fetchIngredients(link);
		ingredientsList.push(...ingredients);
	}

	const groceryList = consolidateGroceryList(ingredientsList);
	return groceryList;
}

async function fetchIngredients(url: string) {
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);
		const ingredients: string[] = [];

		$('span[data-ingredient-name="true"]').each((_, element) => {
			ingredients.push($(element).text().trim());
		});

		return ingredients;
	} catch (error) {
		console.error(`Failed to fetch ingredients for ${url}: `, error);
		return [];
	}
}

function consolidateGroceryList(ingredientsList: string[]) {
    const consolidatedList: { [key: string]: { quantity: number; unit: string } } = {};

    ingredientsList.forEach(ingredient => {
      const [quantity, unit, ...rest] = ingredient.split(' ');
      const name = rest.join(' ');
  
      if (!consolidatedList[name]) {
        consolidatedList[name] = {
          quantity: parseFloat(quantity) || 0,
          unit: unit || '',
        };
      } else {
        if (unit === consolidatedList[name].unit) {
          consolidatedList[name].quantity += parseFloat(quantity) || 0;
        } else {
          console.warn(`Different units for ${name}: ${unit} and ${consolidatedList[name].unit}. Values not combined.`);
        }
      }
    });
  
    const formattedList = Object.entries(consolidatedList).map(([name, { quantity, unit }]) => {
      return `${quantity} ${unit} ${name}`;
    });
  
    return formattedList;
  }
