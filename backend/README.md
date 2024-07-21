# Teste técnico Meu Gutu - Back-End

## 📝 Descrição:
Uma API RESTful que permite o gerenciamento de usuários. Todas as rotas, com exceção da de login e Health check, necessitam de autenticação. As rotas, com exceção da de listagem de usuários, também são proptegidas por autorização. Ao iniciar o projeto o banco de dados será populado com alguns usuários, sendo um deles um administrador. A senha para login como administrador cadastrado será definida no arquivo ```.env``` e por padrão é ```password```. O e-mail é ```admin@admin.com```.  

## 💻 Tecnologias utilizadas:
- <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
- <a href="https://nodejs.org/en" target="_blank">NodeJS</a>
- <a href="https://nestjs.com/" target="_blank">NestJS</a>
- <a href="https://www.docker.com/" target="_blank">Docker</a>
- <a href="https://www.postgresql.org/">PostgreSQL</a>
- <a href="https://www.prisma.io/" target="_blank">Prisma</a>
- <a href="https://swagger.io/" target="_blank">Swagger</a>
- <a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank">bcrypt</a>
- <a href="https://github.com/helmetjs/helmet" target="_blank">Helmet</a>
- <a href="https://github.com/winstonjs/winston" target="_blank">Winston</a>
- <a href="https://zod.dev/" target="_blank">Zod</a>
- <a href="https://jestjs.io/pt-BR/" target="_blank">Jest</a>

## ⚙️ Iniciando a aplicação:
1. Verifique se está dentro do diretório ```backend``` e crie o arquivo que irá conter as variáveis de ambiente.
  ```
  cp .env.example .env
  ```
2. Suba o container que conterá o banco de dados da aplicação:
  ```
  docker-compose up -d --build
  ```
3. Instale as dependências:
  ```
  npm install
  ```
4. Crie as tabelas, aplique as migrations e popule o banco:
  ```
  npm run db:create
  ```
5. Inicie a aplicação:
  ```
  npm start
  ```
## 🔒 Autorização e Autenticação
Todas as rotas, com exceção da de login e Health check, necessitam de autenticação. O token de autenticação será recebido após login bem sucedido. Para as rotas protegidas é necessário enviar o token no Header da requisição em 'Authorization' no formato ```"Bearer token"```.


Há 2 níveis de papéis para os usuários, Administrador e Usuário. Por padrão, um usuário será criado com papel de usuário. É necessário papel de Administrador para criar, editar e excluir usuários.

## 🗒️ Logs
A aplicação contém registro de logs. Os logs são inscritos no arquivo ```combined.log```, que fica no diretório ```logs```. Com os logs é possível verificar:
- O tipo e a rota da requisição feita;
- O status HTTP da requisição;
- O tempo de execução;
- O ID do usuário que fez a rquisição;
- O corpo da requisição com senhas ocultadas.


## 🧪 Testes
A aplicação possui testes unitários para verificar o seu funcionamento. Dentro do diretório ```backend``` utilize o comando ```npm test``` para executa-los.


## 🗺️ Funcionalidades
Caso prefira, a aplicação possui suas rotas documentadas por meio do <a href="https://swagger.io/" target="_blank">Swagger</a> e pode ser accessada em <a href="http://localhost:3001/api" target="_blank">http://localhost:3001/api</a>.

1. Health check através do endpoint ```GET /```

2. Login através do endpoint ```/auth/login```
   - O corpo da requisição deverá ser no seguinte formato:
     ```
     {
     "email": "admin@admin.com",
     "password": "password"
     }
     ```
3. Criação de usuários através do endpoint ```POST /user```
   - O corpo da requisição deverá ser no seguinte formato:
     ```
     {
     "email": "maria@email.com",
     "password": "senha123*",
     "name": "Maria",
     "phone": "(32) 99988-5689)",
     "cpf": "088.585.547-56",
     "admin": false
     }
     ```
   - A proprieda admin é opcional, sendo por padrão ```false```.
   - Necessário autorização de ```admin```.
4. Listagem dos usuários na rota ```GET /user```.
   - A rota possui funcionalidade de paginação e de filtragem de usuários por nome e e-mail por meio de querys. Todas as querys são opcionais.
   - Utilize ```page``` para definir o número da página, sendo que o valor padrão é ```1```
   - Utilize ```limit``` para definir o número de usuários por requisição, sendo que o valor padrçao é ```10```.
   - Utilize ```filter``` para filtrar por nome ou e-mail.
   - Uma requisição com os 3 parâmetros ficaria assim:
     ```http://localhost:3001/user?page=1&limit=20&filter=ana```
5. Atualização de usuários na rota ```PATCH /user/:id```.
   - O corpo da requisição deverá ser no seguinte formato:
     ```
     {
     "email": "maria@email.com",
     "password": "senha123*",
     "name": "Maria",
     "phone": "(32) 99988-5689)",
     "cpf": "088.585.547-56",
     "admin": false
     }
     ```
   - Necessário autorização de ```admin```.
   - Os campos ```password``` e ```admin``` são opcionais.
6. Remoção de usuários na rota ```DELETE /user/:id```.
   - Necessário autorização de ```admin```.



     
     
