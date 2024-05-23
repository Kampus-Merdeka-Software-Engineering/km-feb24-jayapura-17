async function loadJSON(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Memanggil fungsi untuk memuat file JSON dan menampilkan isinya
loadJSON('lalala.json')
    .then(data => {
        const konten = document.getElementById('konten');
        konten.innerHTML = `
            <p>transaction_id: ${data.transaction_id}</p>
            <p>transaction_date: ${data.transaction_date}</p>
            <p>day_: ${data.day_}</p>
            <p>month: ${data.month}</p>
            <p>hour_: ${data.hour_} </p>
            <p>transaction_time: ${data.transaction_time}</p>
            <p>transaction_qty: ${data.transaction_qty}</p>
            <p>store_id: ${data.store_id} </p>
            <p>store_location: ${data.store_location}</p>
            <p>unit_price: ${data.unit_price}</p>
            <p>product_id: ${data.product_id} </p>
            <p>menu_category: ${data.menu_category} </p>
            <p>product_category: ${data.product_category}</p>
            <p>product_type: ${data.product_type}</p>
            <p>product_detail: ${data.product_detail} </p>
            <p>sales_revenue: ${data.sales_revenue} </p>
            <p>time_category: ${data.time_category}</p>
            <p>day_category: ${data.day_category}</p>
            <p>price_range: ${data.price_range} </p>
        `;
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
    });