// Script pour générer les mots de passe hashés
const bcrypt = require('bcrypt');

async function generatePasswords() {
    const passwords = {
        'admin123': await bcrypt.hash('admin123', 11),
        'prof123': await bcrypt.hash('prof123', 11), 
        'eleve123': await bcrypt.hash('eleve123', 11)
    };
    
    console.log('Mots de passe hashés:');
    console.log('admin123:', passwords['admin123']);
    console.log('prof123:', passwords['prof123']);
    console.log('eleve123:', passwords['eleve123']);
}

generatePasswords().catch(console.error);