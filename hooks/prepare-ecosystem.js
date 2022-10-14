const fs = require('fs');
const ecosystem = require('../ecosystem.config');

const renderEcosystem = () => {
  const ecosystemJson = JSON.stringify(ecosystem, null, 2);

  fs.writeFileSync(`${__dirname}/../ecosystem.json`, ecosystemJson);
};

renderEcosystem();
