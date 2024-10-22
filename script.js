// Craftable items data
let craftableItems = [];
let inventory = {};

// Fetch crafting items from JSON file and set up inventory dynamically
async function fetchCraftingItems() {
    try {
        const response = await fetch('craftingItems.json');
        const data = await response.json();
        craftableItems = data.items;

        // Set up inventory dynamically based on the materials in the items
        craftableItems.forEach(item => {
            for (let material in item.materials) {
                if (!(material in inventory)) {
                    inventory[material] = 0; // Initialize inventory material if not already present
                }
            }
        });

        populateItems();
    } catch (error) {
        console.error('Error fetching crafting items:', error);
    }
}

// Populate the item selection list with graphical representation
function populateItems(category = "all") {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    craftableItems.forEach(item => {
        if (category === "all" || item.category === category) {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');

            const image = document.createElement('img');
            image.src = `images/${item.name}.png`; // Assumes images are named as the item (e.g., chair.png)
            image.alt = item.name;

            const label = document.createElement('div');
            label.textContent = item.name;

            const quantityLabel = document.createElement('div');
            quantityLabel.classList.add('item-quantity');
            quantityLabel.id = `item-quantity-${item.name}`;
            quantityLabel.textContent = '0';

            const incrementButton = document.createElement('button');
            incrementButton.textContent = '+';
            incrementButton.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityLabel.textContent);
                quantityLabel.textContent = currentQuantity + 1;
            });

            const decrementButton = document.createElement('button');
            decrementButton.textContent = '-';
            decrementButton.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityLabel.textContent);
                if (currentQuantity > 0) {
                    quantityLabel.textContent = currentQuantity - 1;
                }
            });

            itemCard.appendChild(image);
            itemCard.appendChild(label);
            itemCard.appendChild(quantityLabel);
            itemCard.appendChild(incrementButton);
            itemCard.appendChild(decrementButton);
            itemsList.appendChild(itemCard);
        }
    });
}

// Calculate materials needed and update the summary table
function calculateMaterials() {
    const summary = {};

    // Calculate total materials needed
    craftableItems.forEach(item => {
        const quantity = parseInt(document.getElementById(`item-quantity-${item.name}`).textContent);
        if (quantity > 0) {
            for (let material in item.materials) {
                if (!summary[material]) {
                    summary[material] = 0;
                }
                summary[material] += item.materials[material] * quantity;
            }
        }
    });

    updateSummary(summary);
}

// Update the summary table dynamically with editable inventory input fields
function updateSummary(summary = {}) {
    const summaryBody = document.getElementById('summary-body');
    summaryBody.innerHTML = '';

    for (let material in summary) {
        const row = document.createElement('tr');

        const materialCell = document.createElement('td');
        materialCell.textContent = material;

        const neededCell = document.createElement('td');
        neededCell.textContent = summary[material];

        const inventoryCell = document.createElement('td');
        const inventoryInput = document.createElement('input');
        inventoryInput.type = 'number';
        inventoryInput.min = '0';
        inventoryInput.value = inventory[material];
        inventoryInput.id = `inventory-${material}`;
        inventoryInput.addEventListener('input', (e) => {
            inventory[material] = parseInt(e.target.value);
        });
        inventoryCell.appendChild(inventoryInput);

        row.appendChild(materialCell);
        row.appendChild(neededCell);
        row.appendChild(inventoryCell);
        summaryBody.appendChild(row);
    }
}

// Event listeners
document.getElementById('calculate-btn').addEventListener('click', calculateMaterials);
document.getElementById('category-filter').addEventListener('change', (e) => {
    populateItems(e.target.value);
});

// Initial setup
fetchCraftingItems();
