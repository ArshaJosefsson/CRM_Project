let currentData = [];
let currentSortColumn = '';
let currentSortOrder = 'asc';
let currentEntity = '';

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
  
    document.getElementById(sectionId).style.display = 'block';
}

async function fetchData(entity) {
    const response = await fetch(`/${entity}`);
    const data = await response.json();
    currentData = data;
    currentEntity = entity;

    if (entity === 'customers') {
        renderTable(entity, data, 'customers-table-head', 'customers-table-body');
        showSection('customers-section');
    } else if (entity === 'contacts') {
        renderTable(entity, data, 'contacts-table-head', 'contacts-table-body');
        showSection('contacts-section');
    } else if (entity === 'interactions') {
        renderTable(entity, data, 'interactions-table-head', 'interactions-table-body');
        fetchInteractionTypeData(); // Load interaction type chart
        showSection('interactions-section');
    } else if (entity === 'products') {
        renderTable(entity, data, 'products-table-head', 'products-table-body');
        fetchPriceRangeData(); // Load price range chart
        showSection('products-section');
    }
}

function renderTable(entity, data, tableHeadId, tableBodyId) {
    const tableHead = document.getElementById(tableHeadId);
    const tableBody = document.getElementById(tableBodyId);
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No data available</td></tr>';
        return;
    }

    // Create table headers dynamically based on the data received
    const headers = Object.keys(data[0]);
    let headRow = '<tr>';
    headers.forEach(header => {
        headRow += `<th onclick="sortTable('${header}')">${header} <span id="sort-${header}"></span></th>`;
    });
    headRow += '</tr>';
    tableHead.innerHTML = headRow;

    // Create table rows
    data.forEach(item => {
        let row = '<tr>';
        headers.forEach(header => {
            row += `<td>${item[header]}</td>`;
        });
        row += '</tr>';
        tableBody.innerHTML += row;
    });
}

function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortOrder = 'asc';
    }

    const sortedData = currentData.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];

        // Parse dates if the column is a date field
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);

        // Check if the values are valid dates
        if (!isNaN(dateA) && !isNaN(dateB)) {
            if (dateA < dateB) {
                return currentSortOrder === 'asc' ? -1 : 1;
            }
            if (dateA > dateB) {
                return currentSortOrder === 'asc' ? 1 : -1;
            }
        } else {
            // Fallback to number or string comparison
            const numA = parseFloat(valueA);
            const numB = parseFloat(valueB);

            if (!isNaN(numA) && !isNaN(numB)) {
                if (numA < numB) {
                    return currentSortOrder === 'asc' ? -1 : 1;
                }
                if (numA > numB) {
                    return currentSortOrder === 'asc' ? 1 : -1;
                }
            } else {
                if (valueA < valueB) {
                    return currentSortOrder === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return currentSortOrder === 'asc' ? 1 : -1;
                }
            }
        }

        return 0;
    });

    renderTable(currentEntity, sortedData, `${currentEntity}-table-head`, `${currentEntity}-table-body`);
    document.getElementById(`sort-${currentSortColumn}`).textContent = currentSortOrder === 'asc' ? '🔼' : '🔽';
}

async function fetchPriceRangeData() {
    const response = await fetch('/products');
    const data = await response.json();

    const priceRanges = [
        { label: '< $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 - $500', min: 200, max: 500 },
        { label: '$500 - $1000', min: 500, max: 1000 },
        { label: '> $1000', min: 1000, max: Infinity }
    ];

    const priceCounts = priceRanges.map(range => {
        return {
            label: range.label,
            count: data.filter(product => product.price >= range.min && product.price < range.max).length
        };
    });

    const labels = priceCounts.map(range => range.label);
    const counts = priceCounts.map(range => range.count);

    const ctx = document.getElementById('priceRangeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Products',
                data: counts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function fetchInteractionTypeData() {
    const response = await fetch('/interactions');
    const data = await response.json();

    const interactionTypes = ['email', 'phone call', 'meeting'];

    const interactionCounts = interactionTypes.map(type => {
        return {
            label: type,
            count: data.filter(interaction => interaction.interaction_type === type).length
        };
    });

    const labels = interactionCounts.map(type => type.label);
    const counts = interactionCounts.map(type => type.count);

    const ctx = document.getElementById('interactionTypeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Interactions',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
