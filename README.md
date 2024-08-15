# Maketplace API

## Descrição
A API de Marketplace é uma solução tecnológica de alto projetada para habilitar a criação e operação
de marketplaces digitais. Desenvolvida para atender às demandas de empresas que desejam estabelecer
uma presença online, essa API oferece recursos avançados e uma estrutura robusta.

## Funcionalidades Principais
* Autenticação e Autorização: Integração de autenticação e autorização, baseado em JWT.
* Gestão de Pedidos: Rastreamento e gestão de pedidos efetuados e atualização de status.
* Avaliações: Capacidade de coletar, exibir e gerenciar avaliações de produtos.
* Pesquisa: Ferramentas para pesquisa de produtos com base em nome e descrição.
* Administração: Área administrativa para gestão de usuários, produtos e vendas.
* Gestão de Produtos: A API permite a gestão fácil de produtos, incluindo estoque.

## Tecnologias Utilizadas
* Node.js
* Prisma
* JWT
* Bcrypt
* MySQL

## DER
![modelo](https://github.com/gab-braga/marketplace-api/assets/66652642/951edae9-6476-4fc4-ae95-c884bcf4bf44)

## Endpoints
### Autenticação e Cadastro
* POST `/auth/login`,
* POST `/auth/register`,

### Área Pública
* GET `/public/products`,
* GET `/public/products/{id}`,
* GET `/public/products/category/{category}`,
* GET `/public/products/search/{name}`,

### Área de Perfil
* GET `/client/profile/{id}`,
* GET `/client/profile/{id}/address`,
* PUT `/client/profile/{id}`,
* PUT `/client/profile/{id}/address`,
* PUT `/client/profile/{id}/password`,
* PUT `/client/profile/{id}/photo`,

### Carrinho de Compras
* GET `/client/cart/{id}`,
* POST `/client/cart/{id}/add`,
* PUT `/client/cart/{id}/item`,
* POST `/client/cart/{id}/finish`,

### Pedidos
* GET `/client/orders/{id}`,
* GET `/client/orders/{idU}/products/{idP}`,
* GET `/client/orders/purchase/{id}`,
* POST `/client/orders/{id}/evaluate`,

### Gestão de Usuários
* GET `/admin/users`,
* GET `/admin/users/{id}`,
* PUT `/admin/users/{id}/enable`,
* PUT `/admin/users/{id}/disable`,

### Gestão de Produtos
* GET `/admin/products`,
* GET `/admin/products/{id}`,
* POST `/admin/products`,
* PUT `/admin/products/{id}`,

### Gestão de Vendas
* GET `/admin/purchases`,
* GET `/admin/purchases/{id}`,
* GET `/admin/purchases/{id}/items`,
* PUT `/admin/purchases/{id}/status`,

## Como Usar
 1. Clone o repositório: `git clone https://github.com/gab-braga/marketplace-api`
 2. Acesse o diretório do projeto: `cd marketplace-api`
 3. Instale as dependências: `npm install`
 4. Copie e cole o arquivo `.env` e configure as variáveis
 5. Inicie o servidor: `npm start`

## Contribuição
Se você quiser contribuir para este projeto, siga estas etapas:
1. Faça um fork do repositório.
2. Crie uma nova branch com sua feature: `git checkout -b minha-feature`
3. Faça o commit das mudanças: `git commit -m 'Adicione minha feature'`
4. Envie para o repositório original: `git push origin minha-feature`
5. Crie um pull request.
