const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./test.db')

// db.serialize() handles asynchronous issues, this way each sql statement is executed in order one by one
// this is as opposed to db.parallelize() which will run the functions in parallel and no particular order of// execution is followed

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS peoples(
      id INTEGER PRIMARY KEY, 
      first_name TEXT NOT NULL, 
      last_name TEXT NOT NULL, 
      email TEXT NOT NULL UNIQUE, 
      phone TEXT NOT NULL UNIQUE)`,
        console.log('peoples table created'),
    )

    db.run(
        `INSERT OR IGNORE INTO peoples VALUES
    (1, 'Brad', 'Pitt', 'justsomedude@atom.com', '666-999-9999'),
    (2, 'Jennifer', 'Lopez', 'regulargal@bored.org', '888-999-9595')`,
        console.log('peoples table is populated'),
    )

    db.run(
        `DELETE FROM peoples WHERE id = ?`,
        ['2'],
        console.log('row was deleted'),
    )

    db.run(
        `UPDATE peoples SET first_name = ? WHERE first_name = ?`,
        ['Bob', 'Brad'],
        err => {
            console.log(`updated row(s)`)
        },
    )

    // db.get() will return only the first row of a match from the sql statement returns JSON format
    db.all(`SELECT * FROM peoples`, [], (err, rows) => {
        rows.forEach(row => {
            console.log(row)
        })
    })

    db.run(`DROP TABLE IF EXISTS peoples`)
})

db.close()
