const fs = require("fs");
const { parse } = require("csv-parse");

// Make post request to localhost:3000/api/transaction/create with payload
// {
//   "is_positive": true,
//   "amount_cents": 500000,
//   "category": "Food",
//   "description": "Balling",
//   "timestamp_utc": "2024-07-05T14:00:00Z"
// } for each row

fs.createReadStream("./data.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row: any) {
    console.log(row);
    const body = JSON.stringify({
      is_positive: true,
      amount_cents: Number(row[3]) * 100,
      category: row[2],
      description: row[1],
      timestamp_utc: `${row[0]}T00:00:00Z`,
    });
    console.log(body);
    await fetch("http://localhost:3000/api/transaction/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  });
