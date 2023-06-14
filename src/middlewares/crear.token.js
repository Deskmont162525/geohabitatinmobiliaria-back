const crypto = require('crypto');

exports.generateToken = () => {
    const secret = 'mysecretkeygeohabit'; // Esta debería ser una clave secreta más segura en un ambiente real
    const text = 'Soy el Mejor';
    
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(secret).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const token = `${iv.toString('hex')}:${encrypted}`;
    
    console.log(token);
}