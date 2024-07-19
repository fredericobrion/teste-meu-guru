# Teste técnico Meu Guru

## 📝 Descrição:
Um projeto fullstack para gerenciamento de usuários. Após estar logado é possível listar e filtrar os usuários. Caso seja administrador, é possível editar, criar e remover usuários. A auteniticação é realizada através de token JWT e a autorização através do cargo.

## 💻 Tecnologias utilizadas:
Dentro do README de cada diretório há todas as tecnologias utilizadas.

## ⚙️ Iniciando a aplicação:

## 🧪 Testes

## 🗺️ Funcionalidades
### Frontend
A página inicial é a de login. Há um usuário pré cadastrado no banco de dados com o email ```admin@admin.com``` que possui papel de administrador. A senha do login foi estabelecida no arquivo ```.env``` do backend. Após logar, será exibido a lista de usuários cadastrados. É possível editar e excluir cada um, além de criar novos usuários. As páginas de criação ('/create') e de listagem de usuários ('/users-list') só estará disponível se estiver logado.

### Backend
