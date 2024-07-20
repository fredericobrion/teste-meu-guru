# Teste técnico Meu Gutu - Frontend

## 📝 Descrição:
A aplicação é uma interface que permite o gerenciamento de usuários de uma base de dados. É necessário estar logado para ver os usuários e ser administrador para editar e criar usuários. 

## 💻 Tecnologias utilizadas:
- <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
- <a href="https://nextjs.org/" target="_blank">NextJS</a>
- <a href="https://react.dev/" target="_blank">React</a>
- <a href="https://tailwindcss.com/">Tailwind</a>
- <a href="https://axios-http.com/">Axios</a>
- <a href="https://sweetalert2.github.io/">SweetAlert2</a>
- <a href="https://github.com/auth0/jwt-decode">jwt-decode</a>
- <a href="https://github.com/js-cookie/js-cookie">js-cookie</a>
- <a href="https://heroicons.com/">Heroicons</a>
- <a href="https://vitest.dev/">vitest</a>
- <a href="https://www.npmjs.com/package/jwt-decode">jwt-decode</a>

## ⚙️ Iniciando a aplicação:
1. Verifique se está dentro do diretório ```frontend``` e crie o arquivo que irá conter as variáveis de ambiente:
  ```
  cp .env.example .env
  ```
2. Instale as dependências:
  ```
  npm install
  ```
3. Faça o build da aplicação e inicie ela:
  ```
  npm run build && npm start
  ```

## 🧪 Testes
A aplicação possui testes unitários para verificar o seu funcionamento. Dentro do diretório ```frontend``` utilize o comando ```npm test``` para executa-los.

## 🗺️ Funcionalidades
1. A página <a href="http://localhost:3000/">inicial</a> é onde é feito o login com e-mail e senha.
   - Há um usuário pré cadastrado com papel de admin. O e-mail é ```admin@admin.com``` e a senha é a senha definida no ```.env``` do backend. Por padrão ```password```.
2. A página de <a href="http://localhost:3000/users-list">listagem de usuários</a> é onde é permitido, para administradores, editar e excluir usuários. É necessário estar logado para acessa-la.
3. A página de <a href="http://localhost:3000/create">crição de usuários</a> é onde é permitido, para administradores, criar usuários. É necessário estar logado para acessa-la.
