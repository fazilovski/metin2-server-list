const fs = require('fs');
const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb+srv://azimligil62_db_user:metin123@cluster0.qmdoqsb.mongodb.net/metin2?retryWrites=true&w=majority;"
const client = new MongoClient(url);

let db;

async function baglan() {
    try {
        await client.connect();
        db = client.db("metin2");
        console.log("MongoDB bağlandı");
    } catch (err) {
        console.log("MongoDB HATA:", err.message);
    }
}

const server = http.createServer(async (req, res) => {

    if (req.url === "/") {
        fs.readFile("index.html", (err, data) => {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(data);
        });
        return;
    }

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url.startsWith("/serverlar")) {
        let serverlar = await db.collection("serverlar").find().toArray();
        res.end(JSON.stringify(serverlar));
    }

    else if (req.method === "DELETE" && req.url.startsWith("/sil")) {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        const veri = JSON.parse(body);

        await db.collection("serverlar").deleteOne({
            _id: new ObjectId(veri.id)   // 👈 BURASI
        });

        res.end(JSON.stringify({ mesaj: "Silindi" }));
    });
}
});


// 🔥 EN KRİTİK KISIM BURASI
(async () => {
    await baglan();

     PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server çalıştı: " + PORT);
});
})();