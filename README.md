# Teste técnico Meu Guru

## 📝 Descrição:
Um projeto fullstack para gerenciamento de usuários. Após estar logado é possível listar e filtrar os usuários. Caso seja administrador, é possível editar, criar e remover usuários. A auteniticação é realizada através de token JWT e a autorização através do cargo.

## 💻 Tecnologias utilizadas:
Dentro do README de cada diretório há todas as tecnologias utilizadas.

## ⚙️ Iniciando a aplicação:
O ```backend``` deverá ser inicializado para o correto funcionamento do ```frontend```
1. Clone o repositório e entre no diretório:
   ```
    git clone git@github.com:fredericobrion/teste-meu-guru.git && cd teste-meu-guru
   ```
2. Entre no diretório ```backend``` e crie as variáveis de ambiente:
   ```
   cd backend && cp .env.example .env
   ```
3. Suba o container que conterá o banco de dados da aplicação:
  ```
  docker-compose up -d --build
  ```
4. Instale as dependências:
  ```
  npm install
  ```
5. Crie as tabelas, aplique as migrations, popule o banco e inicie a aplicação:
  ```
  npm run db:create && npm start
  ```
6. Em um novo terminal entre no diretório ```frontend``` e crie o arquivo que irá conter as variáveis de ambiente:
  ```
  cp .env.example .env
  ```
7. Instale as dependências:
  ```
  npm install
  ```
8. Faça o build da aplicação e inicie ela:
  ```
  npm run build && npm start
  ```

## 🧪 Testes
A aplicação possui testes para o ```frontend``` e para o ```backend```.
  - Para testar o frontend esteja no diretório ```frontend``` e rode o comando ```npm test```
  - Para testar o backend esteja no diretório ```backend``` e rode o comando ```npm test```

## 🗺️ Funcionalidades
### Frontend
A página inicial é a de login. Há um usuário pré cadastrado no banco de dados com o email ```admin@admin.com``` que possui papel de administrador. A senha do login foi estabelecida no arquivo ```.env``` do backend. Após logar, será exibido a lista de usuários cadastrados. É possível editar e excluir cada um, além de criar novos usuários. As páginas de criação ('/create') e de listagem de usuários ('/users-list') só estará disponível se estiver logado.

### Backend
Uma API RESTful que permite o gerenciamento de usuários. Todas as rotas, com exceção da de login e Health check, necessitam de autenticação. As rotas, com exceção da de listagem de usuários, também são proptegidas por autorização. Ao iniciar o projeto o banco de dados será populado com alguns usuários, sendo um deles um administrador. A senha para login como administrador cadastrado será definida no arquivo .env e por padrão é password. O e-mail é admin@admin.com.
