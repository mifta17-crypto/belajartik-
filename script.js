// Mengambil elemen-elemen dari HTML
const form = document.getElementById('contactForm');
const resultDiv = document.getElementById('result');
const submissionList = document.getElementById('submissionList');

// Menambahkan 'event listener' untuk event 'submit' pada form
form.addEventListener('submit', function(e) {
    // Mencegah form melakukan submit bawaan (yang akan me-refresh halaman)
    e.preventDefault();

    // Mengambil data dari form
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Menampilkan pesan bahwa proses pengiriman sedang berlangsung
    resultDiv.innerHTML = "Mengirim data...";
    resultDiv.style.color = "#333";

    // Menggunakan Fetch API untuk mengirim data ke Web3Forms
    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                // Jika pengiriman sukses
                resultDiv.innerHTML = "Data berhasil terkirim!";
                resultDiv.style.color = "green";

                // Tambahkan nama dan email ke daftar di halaman
                addSubmissionToList(object.nama, object.email);

            } else {
                // Jika terjadi error
                console.log(response);
                resultDiv.innerHTML = jsonResponse.message;
                resultDiv.style.color = "red";
            }
        })
        .catch(error => {
            // Jika terjadi error koneksi
            console.log(error);
            resultDiv.innerHTML = "Terjadi kesalahan saat mengirim data!";
            resultDiv.style.color = "red";
        })
        .then(function() {
            // Bagian ini akan selalu dijalankan (baik sukses maupun gagal)
            form.reset(); // Mengosongkan field form
            setTimeout(() => {
                resultDiv.innerHTML = ''; // Menghilangkan pesan setelah 5 detik
            }, 5000);
        });
});

/**
 * Fungsi untuk menambahkan data pengirim ke dalam daftar <ul> di HTML
 * @param {string} name - Nama pengisi form
 * @param {string} email - Email pengisi form
 */
function addSubmissionToList(name, email) {
    const listItem = document.createElement('li'); // Buat elemen <li> baru
    listItem.textContent = `Nama: ${name}, Email: ${email}`; // Isi teksnya
    submissionList.appendChild(listItem); // Tambahkan ke dalam <ul>
}
