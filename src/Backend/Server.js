// Server.js is responsible for interacting with MySQL server

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const port = 3001;

app.use(bodyParser.json());

// Establish connection and get functions from Data

const data = require('./Data');

// Setup Cors options

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
  app.use(cors(corsOptions));

// API points for teams

app.post('/api/joukkueet', async (req, res) => {
  const newJoukkue = req.body;
  const uniqueOsallistumisNro = await data.generateUniqueOsallistumisNro();
  newJoukkue.osallistumis_nro = uniqueOsallistumisNro;
  data.createJoukkue(newJoukkue)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: 'Failed to create joukkue' }));
});

app.get('/api/joukkueet', (req, res) => {
  data.getAllJoukkueet()
    .then(joukkueet => res.json(joukkueet))
    .catch(err => res.status(500).json({ error: 'Failed to retrieve joukkueet' }));
});
  
app.get('/api/joukkueet/:joukkue_id', (req, res) => {
  const joukkueId = parseInt(req.params.joukkue_id);
  data.getJoukkueById(joukkueId)
    .then(joukkue => {
      if (joukkue) {
        res.json(joukkue);
      } else {
        res.status(404).json({ error: 'Joukkue not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Failed to retrieve joukkue' }));
});
  
app.put('/api/joukkueet/:joukkue_id', (req, res) => {
  const joukkueId = parseInt(req.params.joukkue_id);
  const updatedJoukkue = req.body;
  data.updateJoukkue(joukkueId, updatedJoukkue)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Joukkue not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Failed to update joukkue' }));
});
  
app.delete('/api/joukkueet/:joukkue_id', (req, res) => {
  const joukkueId = parseInt(req.params.joukkue_id);
  data.deleteJoukkue(joukkueId)
    .then(result => {
      if (result) {
        res.json({ message: 'Joukkue deleted' });
      } else {
        res.status(404).json({ error: 'Joukkue not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete joukkue' }));
});

app.put('/api/updateJoukkueet', async (req, res) => {
  console.log('Received PUT request:', req.body);
  try {
    const updates = req.body.updates;
    const updatePromises = updates.map(async (update) => {
      const { joukkueId, updatedFields } = update;
      try {
        await data.updateJoukkue(joukkueId, updatedFields);
        return { joukkueId, success: true };
      } catch (error) {
        return { joukkueId, success: false, error: error.message };
      }
    });
    const updateResults = await Promise.all(updatePromises);
    res.json({ success: true, updateResults });
  } catch (error) {
    console.error('Error processing updates:', error);
    res.status(500).json({ success: false, error: 'Failed to process updates' });
  }
});

// API points for tasks
  
app.get('/api/tehtavat', (req, res) => {
  data.getAllTehtävät()
    .then((tehtävät) => res.json(tehtävät))
    .catch((err) => res.status(500).json({ error: 'Failed to retrieve tehtävät' }));
});
  
app.post('/api/tehtavat', async (req, res) => {
  const newTehtävä = req.body;
  data.createTehtävä(newTehtävä)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: 'Failed to create tehtävä' }));
});
  
app.delete('/api/tehtavat/:tehtava_id', (req, res) => {
  const tehtavaId = parseInt(req.params.tehtava_id);
  data.deleteTehtävä(tehtavaId)
    .then(result => {
      if (result) {
        res.json({ message: 'Tehtava deleted' });
      } else {
        res.status(404).json({ error: 'Tehtava not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete tehtava' }));
});
  
  
app.put('/api/tehtavat/:tehtava_id', (req, res) => {
  const tehtavaId = parseInt(req.params.tehtava_id);
  const updatedTehtava = req.body;
  data.updateTehtävä(tehtavaId, updatedTehtava)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Tehtava not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Failed to update tehtava' }));
});
  
app.get('/api/tehtavat/:id', (req, res) => {
  const tehtäväId = req.params.id;
  data.getTehtäväById(tehtäväId)
    .then((tehtävä) => {
      if (tehtävä) {
        res.json(tehtävä);
      } else {
        res.status(404).json({ error: 'Tehtävä not found' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'Failed to retrieve tehtävä' }));
});

// API points for times/leaderboard

app.post('/api/aikataulu', async (req, res) => {
  try {
    const { era, tehtava, joukkueId, aika } = req.body;
      const result = await data.insertAikataulu(era, tehtava, joukkueId, aika);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error inserting time into aikataulu:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/aikataulu', (req, res) => {
  data.getAllTimes()
    .then((times) => res.json(times))
    .catch((err) => res.status(500).json({ error: 'Failed to retrieve times' }));
});
  
// End of functions and port listening

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});