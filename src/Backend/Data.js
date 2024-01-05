// Data.js is responsible for providing functions for Server.js

const mysql = require('mysql');

// Establish connection

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kilpailu',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });

// Functions

  function createJoukkue(newJoukkue) {
    return new Promise((resolve, reject) => {
      const {
        joukkue_nimi,
        jäsenet,
        kaupunki,
        osallistumis_nro,
        semifinalist,
        finalist,
        kerailyera
      } = newJoukkue;
      const query = 'INSERT INTO joukkueet (joukkue_nimi, jäsenet, kaupunki, osallistumis_nro, semifinalist, finalist, kerailyera) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [joukkue_nimi, jäsenet, kaupunki, osallistumis_nro, semifinalist, finalist, kerailyera], (err, results) => {
        if (err) {
          reject(err);
        } else {
          const insertedJoukkueId = results.insertId;
          const selectQuery = 'SELECT * FROM joukkueet WHERE joukkue_id = ?';
          db.query(selectQuery, [insertedJoukkueId], (selectErr, selectResults) => {
            if (selectErr) {
              reject(selectErr);
            } else {
              resolve(selectResults[0]);
            }
          });
        }
      });
    });
  }
  
// Generate unique number for determining departure order

  async function generateUniqueOsallistumisNro() {
    let uniqueOsallistumisNro;
    do {
      uniqueOsallistumisNro = Math.floor(Math.random() * 1000);
      const isUnique = await checkOsallistumisNroIsUnique(uniqueOsallistumisNro);
      if (isUnique) {
        break;
      }
    } while (true);
    return uniqueOsallistumisNro;
  }
  
  async function checkOsallistumisNroIsUnique(osallistumisNro) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM joukkueet WHERE osallistumis_nro = ?';
      db.query(query, [osallistumisNro], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length === 0);
        }
      });
    });
  }

// Update, get and delete teams

  function getAllJoukkueet() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM joukkueet';
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  function getJoukkueById(joukkueId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM joukkueet WHERE joukkue_id = ?';
      db.query(query, [joukkueId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
function updateJoukkue(joukkueId, updatedJoukkue) {
  return new Promise((resolve, reject) => {
    const { kerailyera, ...rest } = updatedJoukkue;
    if (Object.keys(rest).length === 0) {
      const query = 'UPDATE joukkueet SET kerailyera = ? WHERE joukkue_id = ?';
      db.query(query, [kerailyera, joukkueId], (err, results) => {
        if (err) {
          console.error('Error in updateJoukkue query:', err);
          reject(err);
        } else if (results.affectedRows === 0) {
          console.log('No rows affected in updateJoukkue');
          resolve(null);
        } else {
          console.log('Update successful in updateJoukkue');
          resolve({ joukkue_id: joukkueId, kerailyera, ...rest });
        }
      });
    } else {
      const updateFields = Object.keys(rest)
        .map((key) => `${key} = ?`)
        .join(', ');

      const query = `UPDATE joukkueet SET ${updateFields}, kerailyera = ? WHERE joukkue_id = ?`;

      const values = [...Object.values(rest), kerailyera, joukkueId];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Error in updateJoukkue query:', err);
          reject(err);
        } else if (results.affectedRows === 0) {
          console.log('No rows affected in updateJoukkue');
          resolve(null);
        } else {
          console.log('Update successful in updateJoukkue');
          resolve({ joukkue_id: joukkueId, ...updatedJoukkue });
        }
      });
    }
  });
}

  function deleteJoukkue(joukkueId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM joukkueet WHERE joukkue_id = ?';
      db.query(query, [joukkueId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.affectedRows === 0) {
          resolve(null);
        } else {
          resolve({ joukkue_id: joukkueId });
        }
      });
    });
  }

// Update, get and delete tasks

  function getAllTehtävät() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tehtävät';
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  function createTehtävä(newTehtävä) {
    return new Promise((resolve, reject) => {
      const { tehtävä_nimi, max_aika } = newTehtävä;
      const insertQuery = 'INSERT INTO tehtävät (tehtävä_nimi, max_aika) VALUES (?, ?)';
      db.query(insertQuery, [tehtävä_nimi, max_aika], (err, results) => {
        if (err) {
          reject(err);
        } else {
          const insertedTehtäväId = results.insertId;
          const selectQuery = 'SELECT * FROM tehtävät WHERE id = ?';
          db.query(selectQuery, [insertedTehtäväId], (selectErr, selectResults) => {
            if (selectErr) {
              reject(selectErr);
            } else {
              resolve(selectResults[0]);
            }
          });
        }
      });
    });
  }
  
  function deleteTehtävä(tehtäväId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tehtävät WHERE id = ?';
      db.query(query, [tehtäväId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.affectedRows === 0) {
          resolve(null);
        } else {
          resolve({ id: tehtäväId });
        }
      });
    });
  }
  
function updateTehtävä(tehtäväId, updatedTehtävä) {
  return new Promise((resolve, reject) => {
    const { tehtävä_nimi, max_aika } = updatedTehtävä;
    const query = 'UPDATE tehtävät SET tehtävä_nimi = ?, max_aika = ? WHERE id = ?';
    db.query(query, [tehtävä_nimi, max_aika, tehtäväId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.affectedRows > 0);
      }
    });
  });
}

function getTehtäväById(tehtäväId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tehtävät WHERE id = ?';
    db.query(query, [tehtäväId], (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Inserting and getting times 

function insertAikataulu(era, tehtava, joukkue_id, aika) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO aikataulu (era, tehtava, joukkue_id, aika) VALUES (?, ?, ?, ?)';
    db.query(query, [era, tehtava, joukkue_id, aika], (err, results) => {
      if (err) {
        console.error('Error inserting time into aikataulu:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getAllTimes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM aikataulu';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


// All functions up for exporting 
  
  module.exports = {
    createJoukkue,
    generateUniqueOsallistumisNro,
    getAllJoukkueet,
    getJoukkueById,
    updateJoukkue,
    deleteJoukkue,
    getAllTehtävät,
    createTehtävä,
    deleteTehtävä,
    updateTehtävä,
    getTehtäväById,
    insertAikataulu,
    getAllTimes
  };