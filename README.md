```bash
# NPM install
$ npm install

# NEST install
$ npm i @nestjs/cli

# Start project (dev)
$ npm run start:dev
```

###### QUESTÕES TEÓRICAS ######
# 1: Primeiramente criaria (caso ainda não existisse) uma tabela para salvar os vínculos entre usuário e empresa (n:n). Então, adicionaria ao retorno das funções uma nova propriedade, do tipo array, contendo os vínculos (e não retornando somente 1:n, como era feito anteriormente). Na medida em que a propriedade antiga deixa de ser usada, é possível removê-la gradualmente. Da mesma forma, adaptaria as funções internas para este novo formado, criando versões alternativas para realizar a tratativa quando necessário.
# 2: Executaria uma função que passaria por cada arquivo existente no sistema. Esta função irá acessar o caminho do arquivo e, então, baixá-lo novamente (agora com a limitação de tamanho), substituindo a versão anterior. Para as novas imagens, o devido ajuste de parametrização no recebimento já contempla o problema adequadamente.