# Serviço de checkout

O objetivo desse repositório é prover um serviço de checkout para os sistemas The Starter

# Definições do projeto

-   NodeJS com Typescript
-   Banco de dados MongoDB
-   PrismaORM
-   Todas as escritas de variáveis, rotas, etc, devem utilizar `camelCase`, com únicas exceções: 1 - Classes em geral devem utilizar `PascalCase`; 2 - Constantes em geral devem utilizar `SNAKE_CASE` com caixa alta.
-   Não é admitido tipo `any`, sempre devemos tipar em interfaces
-   Interfaces e outras definições de tipos não devem ficar nos mesmos arquivos que contém a lógica da aplicação
-   O número máximo de argumentos para **qualquer** função ou método é 3. Acima disso deve ser utilizada outra estratégia de parametrização

# Definições de atualização

-   Antes de enviar um commit para a nuvem, rodar `npm run check`. Esse comando irá formatar os arquivos e verificar a lintagem. Isso garantirá que o código está pronto para ser entregue.

# Formatação e lintagem

Esse projeto utiliza ESLint para verificação da lintagem e Prettier para formatar o código.
Por padrão é utilizado TAB 4 como espaçamento.
