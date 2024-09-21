const io = require('socket.io-client');
const readline = require('readline');

// Configurar la entrada de consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Preguntar al usuario por los datos de conexión
rl.question('Ingresa el host (por ejemplo, localhost): ', (host) => {
    rl.question('Ingresa el puerto (por ejemplo, 3000): ', (puerto) => {
        rl.question('Ingresa tu nombre de usuario: ', (username) => {

            // Conectar al servidor utilizando el host y puerto proporcionados
            const socket = io(`http://${host}:${puerto}`);

            // Enviar el nombre de usuario al conectarse
            socket.on('connect', () => {
                console.log(`Conectado al servidor en ${host}:${puerto} como ${username}`);
                socket.emit('registrarUsuario', username);
            });

            // Escuchar mensajes del servidor
            socket.on('mensaje', (msg) => {
                console.log(` ${msg}`);
            });

            // Escuchar mensajes privados
            socket.on('mensajePrivado', (msg) => {
                console.log(msg);
            });

            // Escuchar la lista de usuarios conectados
            socket.on('listaUsuarios', (usuarios) => {
                console.log('Usuarios conectados:');
                usuarios.forEach(usuario => {
                    console.log(`- ${usuario}`);
                });
            });

            // Enviar mensajes al servidor desde la consola
            rl.on('line', (input) => {
                if (input.startsWith('@')) {
                    socket.emit('mensaje', input); // Enviar mensaje privado
                }
                else if (input.startsWith('/')) {
                    socket.emit('mensaje', input); // Enviar comandos especiales
                }else {
                    socket.emit('mensaje', ` ${username}: ${input}`); // Enviar mensaje normal
                }
            });

            // Detectar cuando un cliente se desconecta
            socket.on('disconnect', () => {
                console.log('Desconectado del servidor');
                rl.close();
            });
        });
    });
});
